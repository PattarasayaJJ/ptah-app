import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { AuthContext } from "../context/authContext";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import StarModal from "../components/StarModal";

// นำเข้า locale ภาษาไทย
import "moment/locale/th";

moment.locale("th"); // ตั้งค่า locale ภาษาไทย

const Resultstherapy = ({ navigation, route }) => {
  const params = route?.params || {};
  const {
    answers = [],
    missionId = "",
    missionsToEvaluate = [""],
    time = 0,
  } = params;
  const [authState] = useContext(AuthContext);
  const [doctorMessage, setDoctorMessage] = useState("");
  const [exerciseResults, setexerciseResults] = useState([]);
  const [resultTime, setTime] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    handleGetAnswersFromLocal();
  }, []);

  const handleGetAnswersFromLocal = async () => {
    const currentDate = moment().format("DD/MM/YYYY");
    const jsonValue = await AsyncStorage.getItem(
      `answers_${currentDate}_${authState.user._id}`
    );
    const timeValue = await AsyncStorage.getItem(
      `time_${currentDate}_${authState.user._id}`
    );

    const arrValue = jsonValue != null ? JSON.parse(jsonValue) : [];
    const timeAsyncValue =
      time !== 0 ? time : timeValue != null ? Number(timeValue) : 0;

    setexerciseResults([...arrValue, ...answers]);
    setTime(timeAsyncValue);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "ง่าย":
        return "#1DD345";
      case "ปานกลาง":
        return "#E88B00";
      case "ยาก":
        return "#FF6A6A";
      default:
        return "black";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={[styles.levelText, { color: getLevelColor(item.result) }]}>
        {item.result}
      </Text>
    </View>
  );

  const formatTime = (seconds, type) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return type === "hhmm"
      ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
      : `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
          2,
          "0"
        )}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendAnswer = async () => {
    if (doctorMessage.trim() === "" && missionsToEvaluate.length === 0) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อความถึงแพทย์");
      return;
    }

    try {
      const data = {
        userId: authState.user._id,
        missionId: missionId,
        answers: answers,
        suggestion: doctorMessage,
        timeSpent: formatTime(resultTime),
      };

      const response = await axios.post(
        `/mission/${route.params.id}/evaluate`,
        data
      );

      if (response.status === 201) {
        const currentDate = moment().format("DD/MM/YYYY");

        await AsyncStorage.setItem(
          `answers_${currentDate}_${authState.user._id}`,
          JSON.stringify(exerciseResults)
        );

        await AsyncStorage.setItem(
          `time_${currentDate}_${authState.user._id}`,
          `${resultTime}`
        );

        if (missionsToEvaluate.length === 0) {
          checkAllEvaluates();
        } else {
          let missionsToEvaluate = [...route.params.missionsToEvaluate];
          const id = missionsToEvaluate.shift();
          navigation.navigate("StepDetail", {
            id: id,
            missionsToEvaluate,
          });
        }
      }
    } catch (error) {
      console.log("err", error);
      Alert.alert(
        "ขออภัย",
        "คุณสามารถทำการประเมินได้เพียงครั้งเดียวต่อวัน"
      );
    }
  };

  const checkAllEvaluates = async () => {
    try {
      const response = await axios.get("/mission/check/daily-mission/add-star");
      if (response.status === 200) {
        setModalVisible(true);
      }
    } catch (error) {
      console.log("❌ API call failed:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.gradient}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>


      <FlatList
        data={exerciseResults}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // ✅ เพิ่มพื้นที่เลื่อน
        keyboardShouldPersistTaps="handled"

        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.heading}>ผลการกายภาพบำบัด</Text>
              <Text style={styles.date}>
                วันที่ {moment().add(543, "year").format("D MMMM YYYY")}
              </Text>
            </View>
  
        {/* 🔥 ครอบทุกอย่างใน Card */}
        <View style={styles.card}>
            <Text style={styles.time}>
              ระยะเวลาในการทำกายภาพ {formatTime(resultTime)} นาที
            </Text>

            {exerciseResults.length > 0 ? (
              <FlatList
                data={exerciseResults}
                renderItem={renderItem}
                keyExtractor={(item, index) => `exercise-${index}`}
                scrollEnabled={false} // ❗ ป้องกันการเลื่อนซ้อนกับ FlatList หลัก
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  ท่านยังไม่ได้ประเมินผลกายภาพบำบัด
                </Text>
                <Image source={require("../img/emo.png")} style={styles.image} />
              </View>
            )}
          </View>
        </>
      }
        ListFooterComponent={
          answers.length > 0 && (
            <>
              <Text style={styles.label}>ข้อความถึงแพทย์:</Text>
              <TextInput
                style={styles.input}
                value={doctorMessage}
                onChangeText={(text) => setDoctorMessage(text)}
                multiline
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSendAnswer}
              >
                <Text style={styles.submitButtonText}>
                  {missionsToEvaluate.length === 0
                    ? "ส่งแบบประเมิน"
                    : "บันทึกประเมิน"}
                </Text>
              </TouchableOpacity>
            </>
          )
        }
      />
            </TouchableWithoutFeedback>

  
      <StarModal
        isVisible={isModalVisible}
        onCloseSuccess={() => {
          setModalVisible(false);
          navigation.navigate("Step");
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    marginTop: 20,
    fontFamily: "Kanit",
    marginLeft: 20,
    borderLeftWidth: 3,
    paddingLeft: 10,
    borderColor: "#87CEFA",
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 18,
    fontFamily: "Kanit",
    paddingLeft: 30,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 14,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  time: {
    color: "#333",
    fontFamily: "Kanit",
    textAlign: "center",
    marginBottom: 15,
  },
  resultList: {
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Kanit",
  },
  levelText: {
    fontSize: 16,
    textAlign: "right",
    marginLeft: 10,
    fontFamily: "Kanit",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    height: 60,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    marginHorizontal: 16,
  },
  submitButton: {
    backgroundColor: "#66C4FF",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    width: "40%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    fontFamily: "Kanit",
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default Resultstherapy;
