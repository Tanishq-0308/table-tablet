package com.tablecontroller.bluetooth

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.util.*
import kotlin.concurrent.thread
import android.util.Base64

class BluetoothModule(private val reactCtx: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactCtx) {

    companion object {
        private const val TAG = "BluetoothNative"
        private const val HC05_NAME = "HC-05"
        private val SPP_UUID: UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    }

    private val adapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var socket: BluetoothSocket? = null
    private var inputStream: InputStream? = null
    private var outputStream: OutputStream? = null
    private var readThread: Thread? = null
    private var isConnected = false
    private val parser = PacketParser()

    override fun getName(): String = "BluetoothNative"

    @ReactMethod
    fun isBluetoothEnabled(promise: Promise) {
        try {
            promise.resolve(adapter?.isEnabled ?: false)
        } catch (e: Exception) {
            Log.e(TAG, "Error checking Bluetooth: ${e.message}")
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun enableBluetooth(promise: Promise) {
        try {
            if (adapter == null) {
                promise.reject("NO_ADAPTER", "Bluetooth adapter not found")
                return
            }
            if (!adapter.isEnabled) {
                val intent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactCtx.startActivity(intent)
                promise.resolve("Bluetooth enable request sent")
            } else {
                promise.resolve("Bluetooth already enabled")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable Bluetooth: ${e.message}")
            promise.reject("ENABLE_FAILED", e.message)
        }
    }

    @ReactMethod
    fun listPairedDevices(promise: Promise) {
        try {
            val devices = Arguments.createArray()
            adapter?.bondedDevices?.forEach { device ->
                val d = Arguments.createMap()
                d.putString("name", device.name)
                d.putString("address", device.address)
                devices.pushMap(d)
            }
            promise.resolve(devices)
        } catch (e: Exception) {
            promise.reject("LIST_ERROR", e.message)
        }
    }

    @ReactMethod
    fun connectToHC05(promise: Promise) {
        thread {
            try {
                if (adapter == null) {
                    promise.reject("NO_ADAPTER", "Bluetooth adapter not found")
                    sendConnectionEvent(false)
                    return@thread
                }

                if (!adapter.isEnabled) {
                    promise.reject("BLUETOOTH_DISABLED", "Bluetooth is disabled")
                    sendConnectionEvent(false)
                    return@thread
                }

                val hc05Device = adapter.bondedDevices?.find { it.name == HC05_NAME }
                if (hc05Device == null) {
                    promise.reject("DEVICE_NOT_FOUND", "HC-05 not found")
                    sendConnectionEvent(false)
                    return@thread
                }

                Log.d(TAG, "Connecting to HC-05: ${hc05Device.address}")
                closeConnection()

                val uuid = hc05Device.uuids?.get(0)?.uuid ?: SPP_UUID
                socket = hc05Device.createRfcommSocketToServiceRecord(uuid)
                adapter.cancelDiscovery()
                socket?.connect()

                inputStream = socket?.inputStream
                outputStream = socket?.outputStream
                isConnected = true

                Log.d(TAG, "✅ Connected to HC-05")
                promise.resolve("Connected")
                sendConnectionEvent(true)
                startReading()

            } catch (e: Exception) {
                Log.e(TAG, "❌ Connection failed: ${e.message}")
                isConnected = false
                promise.reject("CONNECTION_FAILED", e.message)
                sendConnectionEvent(false)
            }
        }
    }

    @ReactMethod
    fun connect(address: String, promise: Promise) {
        thread {
            try {
                if (adapter == null) {
                    promise.reject("NO_ADAPTER", "No adapter")
                    sendConnectionEvent(false)
                    return@thread
                }

                if (!adapter.isEnabled) {
                    promise.reject("BLUETOOTH_DISABLED", "Bluetooth disabled")
                    sendConnectionEvent(false)
                    return@thread
                }

                closeConnection()

                val device = adapter.getRemoteDevice(address)
                val uuid = device.uuids?.get(0)?.uuid ?: SPP_UUID
                socket = device.createRfcommSocketToServiceRecord(uuid)
                adapter.cancelDiscovery()
                socket?.connect()

                inputStream = socket?.inputStream
                outputStream = socket?.outputStream
                isConnected = true

                Log.d(TAG, "✅ Connected to $address")
                promise.resolve("CONNECTED")
                sendConnectionEvent(true)
                startReading()

            } catch (e: Exception) {
                Log.e(TAG, "❌ Connection failed: ${e.message}")
                isConnected = false
                promise.reject("CONNECTION_FAILED", e.message)
                sendConnectionEvent(false)
            }
        }
    }

    @ReactMethod
    fun disconnect(promise: Promise?) {
        try {
            val wasConnected = isConnected
            closeConnection()
            Log.d(TAG, "Disconnected")
            promise?.resolve("Disconnected")
            if (wasConnected) sendConnectionEvent(false)
        } catch (e: Exception) {
            Log.e(TAG, "Disconnect error: ${e.message}")
            promise?.reject("DISCONNECT_FAILED", e.message)
        }
    }

    @ReactMethod
    fun sendCommand(command: ReadableArray, promise: Promise) {
        try {
            if (!isConnected || outputStream == null) {
                promise.reject("NOT_CONNECTED", "Not connected")
                return
            }

            val bytes = ByteArray(command.size())
            for (i in 0 until command.size()) {
                bytes[i] = command.getInt(i).toByte()
            }

            outputStream?.write(bytes)
            outputStream?.flush()
            promise.resolve("Command sent")

        } catch (e: Exception) {
            Log.e(TAG, "Send failed: ${e.message}")
            promise.reject("SEND_FAILED", e.message)
            if (e.message?.contains("socket", ignoreCase = true) == true) {
                isConnected = false
                sendConnectionEvent(false)
            }
        }
    }

    @ReactMethod
    fun send(data: String, promise: Promise) {
        try {
            if (!isConnected || outputStream == null) {
                promise.reject("NOT_CONNECTED", "Not connected")
                return
            }
            outputStream?.write(data.toByteArray())
            outputStream?.flush()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Send error: ${e.message}")
            promise.reject("SEND_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getConnectionStatus(promise: Promise) {
        promise.resolve(isConnected)
    }

    private fun closeConnection() {
        isConnected = false
        readThread?.interrupt()
        try { inputStream?.close() } catch (e: Exception) { }
        try { outputStream?.close() } catch (e: Exception) { }
        try { socket?.close() } catch (e: Exception) { }
        socket = null
        inputStream = null
        outputStream = null
        readThread = null
    }

    private fun startReading() {
        readThread = thread {
            try {
                val input = socket?.inputStream ?: return@thread
                val buffer = ByteArray(1024)
                var bytes: Int

                Log.d(TAG, "📊 Reading data...")
                
                while (!Thread.currentThread().isInterrupted) {
                    bytes = input.read(buffer)
                    if (bytes > 0) {
                        val rawBytes = buffer.copyOfRange(0, bytes)
                        val base64 = Base64.encodeToString(rawBytes, Base64.NO_WRAP)
                        sendLog(base64)
                        val result = parser.processBytes(buffer, bytes)
                        result.angles.forEach { angles ->
                            sendAnglesEvent(angles)
                        }
                    }
                }
            } catch (e: IOException) {
                Log.e(TAG, "Read stopped: ${e.message}")
                isConnected = false
                sendConnectionEvent(false)
            }
        }
    }

    private fun sendConnectionEvent(connected: Boolean) {
        try {
            val params = Arguments.createMap().apply {
                putBoolean("connected", connected)
            }
            reactCtx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onConnectionChanged", params)
            Log.d(TAG, "📡 Connection event: $connected")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send connection event: ${e.message}")
        }
    }

    private fun sendAnglesEvent(angles: TableAngles) {
        try {
            val params = Arguments.createMap().apply {
                putInt("sideTiltLeft", angles.sideTiltLeft)
                putInt("sideTiltRight", angles.sideTiltRight)
                putInt("backUp", angles.backUp)
                putInt("backDown", angles.backDown)
                putInt("trendelenburg", angles.trendelenburg)
                putInt("revTrendelenburg", angles.revTrendelenburg)
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }
            reactCtx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onAnglesReceived", params)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send angles: ${e.message}")
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        closeConnection()
    }

private fun sendLog(msg: String) {
    try {
        val params = Arguments.createMap().apply {
            putString("log", msg)
        }
        reactCtx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("BluetoothLog", params)
    } catch (e: Exception) {
        Log.e(TAG, "Failed to send log: ${e.message}")
    }
}

@ReactMethod
fun addListener(eventName: String) {
    Log.d(TAG, "addListener: $eventName")
}

@ReactMethod
fun removeListeners(count: Int) {
    Log.d(TAG, "removeListeners: $count")
}

} 