package com.tablecontroller.bluetooth

import android.util.Log

class PacketParser {
    companion object {
        private const val TAG = "PacketParser"
        
        // ✅ UPDATED: Correct header "CG" (0x43 0x47)
        private const val HEADER1: Byte = 0x43 // 'C'
        private const val HEADER2: Byte = 0x47 // 'G'
        
        // ✅ UPDATED: Correct terminator "N" (0x4E)
        private const val TERMINATOR: Byte = 0x4E // 'N'
        
        private const val PACKET_SIZE = 21
    }

    private val rxBuffer = mutableListOf<Byte>()

    fun processBytes(buffer: ByteArray, length: Int): ParseResult {
        val anglesList = mutableListOf<TableAngles>()

        // Add new bytes to buffer
        for (i in 0 until length) {
            rxBuffer.add(buffer[i])
        }

        // Process complete packets
        while (rxBuffer.size >= PACKET_SIZE) {
            val headerIndex = findHeader()

            if (headerIndex == -1) {
                // No header found, clear if buffer is too large
                if (rxBuffer.size > 100) {
                    Log.w(TAG, "⚠️ Clearing ${rxBuffer.size} garbage bytes")
                    rxBuffer.clear()
                }
                break
            }

            // Skip garbage bytes before header
            if (headerIndex > 0) {
                Log.w(TAG, "⚠️ Skipping $headerIndex garbage bytes")
                repeat(headerIndex) { rxBuffer.removeAt(0) }
            }

            // Need full packet
            if (rxBuffer.size < PACKET_SIZE) break

            val packet = rxBuffer.take(PACKET_SIZE).toByteArray()

            // Verify terminator at position 20
            if (packet[20] == TERMINATOR) {
                // ✅ UPDATED: Correct byte positions based on testing
                // Packet format: CG [2] [3] [4] [5] [6] [7] [8] ... [20]=N
                val angles = TableAngles(
                    sideTiltLeft = packet[2].toInt() and 0xFF,
                    sideTiltRight = packet[3].toInt() and 0xFF,
                    backUp = packet[5].toInt() and 0xFF,
                    backDown = packet[6].toInt() and 0xFF,
                    trendelenburg = packet[7].toInt() and 0xFF,
                    revTrendelenburg = packet[8].toInt() and 0xFF
                )
                
                Log.d(TAG, "🎯 Parsed angles: L=${angles.sideTiltLeft} R=${angles.sideTiltRight} " +
                        "BU=${angles.backUp} BD=${angles.backDown} T=${angles.trendelenburg} RT=${angles.revTrendelenburg}")
                
                anglesList.add(angles)
                repeat(PACKET_SIZE) { rxBuffer.removeAt(0) }
            } else {
                Log.w(TAG, "⚠️ Bad terminator: 0x${(packet[20].toInt() and 0xFF).toString(16)}")
                // Remove first byte and try again
                rxBuffer.removeAt(0)
            }
        }

        return ParseResult(anglesList)
    }

    private fun findHeader(): Int {
        // ✅ UPDATED: Look for "CG" header (2 bytes, not 3)
        for (i in 0 until rxBuffer.size - 1) {
            if (rxBuffer[i] == HEADER1 && rxBuffer[i + 1] == HEADER2) {
                return i
            }
        }
        return -1
    }
    
    // Clear buffer (useful for reconnection)
    fun clearBuffer() {
        rxBuffer.clear()
    }
}

data class TableAngles(
    val sideTiltLeft: Int,
    val sideTiltRight: Int,
    val backUp: Int,
    val backDown: Int,
    val trendelenburg: Int,
    val revTrendelenburg: Int
)

data class ParseResult(val angles: List<TableAngles>)