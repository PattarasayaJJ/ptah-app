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
  const [emptyFieldModal, setEmptyFieldModal] = useState(false); // ✅ เพิ่ม State สำหรับแจ้งเตือนเมื่อไม่ได้กรอกรหัสผ่าน
  const [successModal, setSuccessModal] = useState(false); // ✅ เพิ่ม State สำหรับ Modal แจ้งเตือน

  const [loading, setLoading] = useState(false);

  // Function
  const handleSubmit = async () => {
    // ✅ เช็คว่ามีการกรอกรหัสผ่านหรือไม่
    if (!newPassword || !confirmPassword) {
      setEmptyFieldModal(true);
      return;
    }

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
      setLoading(false);
      setSuccessModal(true); // ✅ แสดง Modal แจ้งเตือนเมื่อสำเร็จ
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

      {/* ✅ Modal แจ้งเตือนเมื่อไม่ได้กรอกรหัสผ่าน */}
      <CustomModal
        isOpen={emptyFieldModal}
        text="กรุณากรอกรหัสผ่านให้ครบ"
        isCancel={false}
        btnText="ปิด"
        onConfirm={() => setEmptyFieldModal(false)}
      />

      {/* ✅ Modal แจ้งเตือนเมื่อรหัสผ่านไม่ตรงกัน */}
      <CustomModal
        isOpen={notMatchModal}
        text="รหัสผ่านไม่ตรงกัน"
        isCancel={false}
        btnText="ปิด"
        onConfirm={() => setNotMatchModal(false)}
      />

      {/* ✅ Modal แจ้งเตือนเมื่อเปลี่ยนรหัสผ่านเสร็จสิ้น */}
      <CustomModal
        isOpen={successModal}
        text="เปลี่ยนรหัสผ่านเสร็จสิ้น!"
        isCancel={false}
        btnText="เข้าสู่ระบบ"
        onConfirm={() => {
          setSuccessModal(false);
          navigation.navigate("Signin"); // ✅ ไปหน้าเข้าสู่ระบบ
        }}
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
    justifyContent: "space-between",
  },
  img: {
    width: 400,
    height: 80,
    marginTop: 130,
    alignSelf: "center",
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
