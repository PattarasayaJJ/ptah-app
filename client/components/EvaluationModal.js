import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const EvaluationModal = ({
  isVisible,
  onClose,
  onSelectLevel,
  missionDetail = {},
  subMissionLength,
  time,
}) => {
  const [selectedLevel, setSelectedLevel] = useState(1); // Default level

  const levels = [
    { id: 1, name: "ง่าย", color: "#1DD345" },
    { id: 2, name: "ปานกลาง", color: "#E88B00" },
    { id: 3, name: "ยาก", color: "#FF6A6A" },
  ];

  const handleConfirm = () => {
    const selected = levels.find((level) => level.id === selectedLevel)?.name;
    onClose(); // Close modal
    onSelectLevel(selected); // Send selected level back to the main screen
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>ประเมินการทำกายภาพบำบัด</Text>
        <Text style={styles.subtitle}>
          ด่านที่{" "}
          {Object.keys(missionDetail).length !== 0
            ? missionDetail?.mission.no
            : ""}
        </Text>
        <Text style={styles.description}>{`ท่าที่ ${subMissionLength + 1} ${
          Object.keys(missionDetail).length !== 0
            ? missionDetail?.submissions[subMissionLength]?.name
            : ""
        }`}</Text>

        {/* Radio buttons */}
        <View style={styles.radioContainer}>
        {levels.map((level) => (
  <TouchableOpacity
    key={level.id}
    style={[styles.radioButton]}
    onPress={() => setSelectedLevel(level.id)}
  >
    <View
      style={[
        styles.radioCircle,
        {
          borderColor: level.color, // Set border color dynamically
        },
        selectedLevel === level.id && {
          backgroundColor: level.color, // Fill background when selected
        },
      ]}
    />
    <Text
      style={[
        styles.radioLabel,
        { color: level.color, fontWeight: "normal" }, // Set text color dynamically and ensure no bold effect
      ]}
    >
      {level.name}
    </Text>
  </TouchableOpacity>
))}


        </View>

        <Text style={styles.timeText}>
          เวลาที่ใช้ไป : {formatTime(time)} น.
        </Text>

        {/* Confirm Button */}
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>ยืนยัน</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    fontFamily:"Kanit"
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    fontFamily:"Kanit"

  },
  description: {
    fontSize: 15,
    color: "black",
    marginBottom: 20,
    fontFamily:"Kanit"

  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  radioButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily:"Kanit",
    fontWeight: "normal", // Ensure normal weight


  },
  confirmButton: {
    backgroundColor: "#66C4FF",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    color: "black",
    marginBottom: 20,
    fontFamily:"Kanit"

  },
});

export default EvaluationModal;
