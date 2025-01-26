import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Modal from "react-native-modal";

const SuccessModal = ({ isVisible, onCloseSuccess, time }) => {
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
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}> คุณทำครบแล้ว !</Text>
        <Image style={styles.tinyLogo} source={require("../img/success.png")} />
        {/* ปุ่มยืนยัน */}
        <Pressable
          style={styles.confirmButton}
          onPress={() => onCloseSuccess()}
        >
          <Text style={styles.confirmButtonText}>ส่งผลกายภาพ</Text>
        </Pressable>
        <Text style={styles.timeText}>
          เวลาที่ใช้ไป : {formatTime(time)} น.
        </Text>
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

    marginBottom: 10,
  },
  tinyLogo: {
    width: "100%",
    resizeMode: "contain",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#008cb7",
    borderRadius: 22,
    padding: 10,
    alignItems: "center",
    width: "50%",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  timeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
});

export default SuccessModal;
