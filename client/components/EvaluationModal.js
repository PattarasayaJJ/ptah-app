import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider"; // ต้องติดตั้งผ่าน npm หรือ yarn ก่อนใช้งาน

const EvaluationModal = ({
  isVisible,
  onClose,
  onSelectLevel,
  missionDetail = {},
  subMissionLength,
  time,
}) => {
  const [sliderValue, setSliderValue] = useState(1); // เริ่มต้นที่ระดับ 1

  const levels = [
    { name: "ง่าย", color: "green" },
    { name: "ปานกลาง", color: "yellow" },
    { name: "ยาก", color: "red" },
  ];
  const getLevelLabel = (value) => {
    if (value === 1) return "ง่าย";
    if (value === 2) return "ปานกลาง";
    if (value === 3) return "ยาก";
    return "";
  };
  const handleConfirm = () => {
    const level = getLevelLabel(sliderValue);
    onClose(); // ปิด Modal
    onSelectLevel(level); // ส่งค่าระดับการประเมินกลับไปยังหน้าหลัก
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
            ? missionDetail?.submissions[subMissionLength].name
            : ""
        }`}</Text>

        {/* Slider */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {levels.map((value, idx) => (
            <Text key={idx} style={[styles.levelLabel, { color: value.color }]}>
              {value.name}
            </Text>
          ))}
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={3}
          step={1}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="gray"
          thumbTintColor="blue"
        />

        <Text style={styles.timeText}>
          เวลาที่ใช้ไป : {formatTime(time)} น.
        </Text>

        {/* ปุ่มยืนยัน */}
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
    padding: 20,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008cb7",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008cb7",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
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
  closeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
});

export default EvaluationModal;
