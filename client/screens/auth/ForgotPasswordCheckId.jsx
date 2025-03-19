import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import InputBox from "../../components/form/InputBox";
import SubmitButton from "../../components/form/SubmitButton";
import axios from "axios";
import CustomModal from "./CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotPasswordCheckId = ({ navigation }) => {
  // State
  const [ID_card_number, setID_card_number] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [email, setEmail] = useState("");

  // Function
  const handleSubmit = async () => {
    if (!ID_card_number) {
            Alert.alert("กรุณากรอกข้อมูล");
            return;
          }
    try {
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("idCardNumber");

      setEmail("");
      setLoading(true);

      const { data } = await axios.post("/auth/check-user-id", {
        idCardNumber: ID_card_number,
      });

      if (!data.success) { // ✅ ตรวจจับ success: false จาก backend
        Alert.alert("เลขบัตรประจำตัวประชาชนไม่ถูกต้อง", data.message);
        setLoading(false);
        return;
      }
  

      setEmail(data.data.email);
      setConfirmModal(true);
      await AsyncStorage.setItem("email", data.data.email);
      await AsyncStorage.setItem("idCardNumber", ID_card_number);
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
      setLoading(false);
      console.log(error);
    }
  };

  const sendOtp = async () => {
    setConfirmModal(false);
    try {
      setLoading(true);

      const { data } = await axios.post("/auth/forget-password", {
        idCardNumber: ID_card_number,
      });
      navigation.navigate("OtpVerification");
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
            inputTitle="รหัสบัตรประชาชน"
            value={ID_card_number}
            setValue={setID_card_number}
            maxLength={13}
          />
          <SubmitButton btnTitle="ตรวจสอบ" handleSubmit={handleSubmit} />

          <Text style={styles.linkText}>
           กลับไปยัง {" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Signin")}
            >
              เข้าสู่ระบบ
            </Text>{" "}
          </Text>
        </View>
      </ScrollView>
      <CustomModal
        isOpen={confirmModal}
        text={
          <View>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.modalText}>นี่คืออีเมลของคุณใช่หรือไม่?</Text>
          </View>
        }        isCancel={true}
        btnText="ยืนยัน"
        onCancel={() => {
          setID_card_number("");
          setConfirmModal(false);
        }}
        onConfirm={sendOtp}
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
    textDecorationLine:"underline"
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
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#87CEFA", // ✅ ปรับเป็นสีน้ำเงิน
    textAlign: "center",
    marginBottom: 5, // ✅ เพิ่มระยะห่าง
    fontFamily: "Kanit",

  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "Kanit",

  },
});

export default ForgotPasswordCheckId;
