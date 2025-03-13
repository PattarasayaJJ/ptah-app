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
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpVerification = ({ navigation }) => {
  // State
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Function
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem("email");
      const idCardNumber = await AsyncStorage.getItem("idCardNumber");

      const { data } = await axios.post("/auth/confirm-otp", {
        email: email,
        otp: otp,
      });
      navigation.navigate("NewPassword");
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
          <InputBox inputTitle="กรอก OTP" value={otp} setValue={setOtp} />
          <SubmitButton btnTitle="ตรวจสอบ" handleSubmit={handleSubmit} />
        </View>
      </ScrollView>
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

export default OtpVerification;
