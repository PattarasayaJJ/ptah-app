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
        <Image
          style={styles.tinyLogo}
          source={require("../img/good.png")}
        />
        <Text style={styles.timeText}>
          เวลาที่ใช้ไป : {formatTime(time)} น.
        </Text>
        <Pressable
          style={styles.confirmButton}
          onPress={() => onCloseSuccess()}
        >
          <Text style={styles.confirmButtonText}>ดูผลการประเมิน</Text>
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
    fontSize: 22,
    color: "black",
    fontFamily: "Kanit",
    marginBottom: 20,
  },
  tinyLogo: {
    width: "100%", // Adjust the width to fit the modal
    height: 150, // Adjust the height as needed
    resizeMode: "contain", // Ensure the image scales correctly within the given dimensions
    marginBottom: 30,
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
    fontFamily: "Kanit",
  },
  timeText: {
    fontSize: 14,
    color: "black",
    marginBottom: 20,
    fontFamily: "Kanit",
  },
});

export default SuccessModal;
