import React, { useState , useContext} from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Modal from "react-native-modal";
import { AuthContext } from "../context/authContext";



const StarModal = ({ isVisible, onCloseSuccess }) => {
   const [authState] = useContext(AuthContext);


  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
      <Text style={styles.starCount}>คุณมีดาวสะสม { (authState.user?.stars|| 0) + 1 } ดาว</Text>  

        <Image style={styles.tinyLogo} source={require("../img/addstar.png")} />
        
        {/* แสดงจำนวนดาวของผู้ใช้ */}

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
    width: "100%", // Adjust the width to fit the modal
    height: 150, // Adjust the height as needed
    resizeMode: "contain", // Ensure the image scales correctly within the given dimensions
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: "#66C4FF",
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
  starCount:{
    marginBottom:15,
    fontFamily:"Kanit",
    fontSize:20

  }
});

export default StarModal;
