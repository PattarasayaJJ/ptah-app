import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React from "react";

const CustomModal = ({
  isOpen = false,
  text = "",
  isCancel = true,
  onClose,
  onCancel,
  onConfirm,
  btnText = "",
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{text}</Text>
          <View style={styles.buttonGroup}>
            {isCancel && (
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={onCancel}
              >
                <Text style={styles.textStyleNo}>ไม่ใช่</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.textStyle}>{btnText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:300,
    height:200
  },
  button: {
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    margin:5,
    width:80
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  buttonConfirm: {
      backgroundColor: "#87CEFA",  
    },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily:"Kanit",

  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontFamily:"Kanit",
    fontSize:20
  },
  buttonGroup: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
  },
  textStyleNo:{
    color: "white",
    textAlign: "center",
    fontFamily:"Kanit",


  }
});

export default CustomModal;
