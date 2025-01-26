import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Modal from "react-native-modal";

const StarModal = ({ isVisible, onCloseSuccess }) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Image style={styles.tinyLogo} source={require("../img/star.png")} />
        <Text style={styles.title}> + 1 ดาว</Text>
        {/* ปุ่มยืนยัน */}
        <Pressable
          style={styles.confirmButton}
          onPress={() => onCloseSuccess()}
        >
          <Text style={styles.confirmButtonText}>ตกลง</Text>
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
    fontWeight: "bold",
    color: "gold",
    marginBottom: 20,
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

export default StarModal;
