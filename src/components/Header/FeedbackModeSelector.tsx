import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFeedback } from "../../contexts/FeedbackContext";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";


const FeedbackModeSelector: React.FC = () => {
  const { mode, setMode } = useFeedback();

  const options = [
    { key: "vibration", label: "Vibration" },
    { key: "sound", label: "Sound" },
  ];

  const handlePress = (key: string) => {
    if(mode === key) {
        setMode("none")
    } else {
        setMode(key as any);
    }
  }

  return (
    <View
      style={styles.container}
    >
      {options.map((opt) => {
        const selected = mode === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
            onPress={() => handlePress(opt.key)}
          >
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: selected ? "#007AFF" : "#aaa",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {selected && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "#007AFF",
                  }}
                />
              )}
            </View>
            <Text style={{ fontSize: 16, color: "#ffffffff" }}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FeedbackModeSelector;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: moderateVerticalScale(12),
        paddingRight:moderateScale(10),
        gap: 24,
    }
})