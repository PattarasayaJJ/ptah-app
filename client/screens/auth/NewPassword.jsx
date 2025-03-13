import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import InputBox from "../../components/form/InputBox";
import SubmitButton from "../../components/form/SubmitButton";
import axios from "axios";
import CustomModal from "./CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewPassword = ({ navigation }) => {
  // State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notMatchModal, setNotMatchModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Function
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setNotMatchModal(true);
      return;
    }

    try {
      setLoading(true);
      const email = await AsyncStorage.getItem("email");
      const idCardNumber = await AsyncStorage.getItem("idCardNumber");

      const { data } = await axios.post("/auth/new-password", {
        idCardNumber: idCardNumber,
        email: email,
        password: confirmPassword,
      });
      navigation.navigate("Signin");
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../../img/logo_blue.png")} style={styles.img} />

        <View style={styles.bginput}>
          <InputBox
            inputTitle="รหัสผ่านใหม่"
            value={newPassword}
            keyboardType="numeric"
            setValue={setNewPassword}
            secureTextEntry={true}
            maxLength={10}
          />

          <InputBox
            inputTitle="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            keyboardType="numeric"
            setValue={setConfirmPassword}
            secureTextEntry={true}
            maxLength={10}
          />
          <SubmitButton btnTitle="ยืนยัน" handleSubmit={handleSubmit} />
        </View>
      </ScrollView>
      <CustomModal
        isOpen={notMatchModal}
        text="Password doesn't match"
        isCancel={false}
        btnText="ปิด"
        onConfirm={() => setNotMatchModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between", // จัดวางให้อยู่ตรงกลาง
  },
  img: {
    width: 400,
    height: 80,
    marginTop: 130,
    alignSelf: "center",
  },
  linkText: {
    textAlign: "center",
    fontFamily: "Kanit",
  },
  link: {
    color: "white",
    fontFamily: "Kanit",
  },
  bginput: {
    backgroundColor: "#87CEFA",
    paddingVertical: 50,
    paddingHorizontal: 50,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 75,
    marginTop: 74,
    flex: 1,
  },
});

export default NewPassword;
