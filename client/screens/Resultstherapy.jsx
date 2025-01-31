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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/authContext";
import moment from "moment";
import "moment/locale/th";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import StarModal from "../components/StarModal";
import HeaderLogo from "./HeaderLogo";

moment.locale("th");

const Resultstherapy = ({ navigation, route }) => {
  const [authState] = useContext(AuthContext);
  const [doctorMessage, setDoctorMessage] = useState("");
  const [exerciseResults, setexerciseResults] = useState([]);
  const [time, setTime] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // handleGetMission();

    setexerciseResults(
      route.params?.answers !== undefined ? route.params.answers : []
    );
    setTime(route.params?.time !== undefined ? route.params.time : 0);
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case "ง่าย":
        return "green";
      case "ปานกลาง":
        return "orange";
      case "ยาก":
        return "red";
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
    try {
      const data = {
        userId: authState.user._id,
        missionId: route.params.missionId,
        answers: exerciseResults,
        suggestion: doctorMessage,
        timeSpent: formatTime(time),
      };

      const response = await axios.post(
        `/mission/${route.params.id}/evaluate`,
        data
      );

      if (response.status === 201) {
        setModalVisible(true);
        if (route.params.missionsToEvaluate.length === 0) {
          navigation.navigate("Step");
        } else {
          let missionsToEvaluate = route.params.missionsToEvaluate;
          const id = missionsToEvaluate.shift();
          // navigation.goBack();
          navigation.navigate("StepDetail", {
            id: id,
            missionsToEvaluate,
          });
        }
      }
    } catch (error) {
      console.log("err", error);
      Alert.alert("ขออภัย", "คุณสามารถทำการประเมินได้เพียงครั้งเดียวต่อวัน");
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#baefff"]} // ไล่สีจากฟ้าจางไปขาว
      style={styles.gradient}
    >
      <View style={{ marginBottom: 60 }}>
        <View style={styles.containerHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome5 name="chevron-left" color="#6bdbfc" size={18} />
          </TouchableOpacity>
          <HeaderLogo />
          <View style={{ marginRight: 30 }} />
        </View>
        <View style={{ flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#6bdbfc",
              marginRight: 12,
            }}
          ></View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>ผลการกายภาพบำบัด</Text>
            <Text style={styles.date}>
              วันที่ {moment().add(543, "year").format("DD MMMM YYYY")}
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={[styles.date, { fontSize: 12 }]}>
              ระยะเวลาในการทำกายภาพ {formatTime(time, "hhmm")} นาที
            </Text>
            <FlatList
              data={exerciseResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.resultList}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>ไม่มีข้อมูลที่จะแสดง</Text>
                </View>
              )}
            />
          </View>
          <Text style={styles.label}>ข้อความถึงแพทย์:</Text>
          <TextInput
            style={styles.input}
            value={doctorMessage}
            onChangeText={(text) => setDoctorMessage(text)}
            multiline
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSendAnswer()}
          >
            <Text style={styles.submitButtonText}>ส่งแบบประเมิน</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <StarModal
        isVisible={isModalVisible}
        onCloseSuccess={() => {
          setModalVisible(false);
          navigation.navigate("Home");
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  containerHeader: {
    marginTop: Platform.OS === "ios" ? 60 : 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    paddingVertical: 20,
    padding: 12,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#C0C0C0",
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
    flex: 1,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
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
  },
  submitButton: {
    backgroundColor: "#008cb7",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
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
    fontSize: 16,
    color: "#888",
  },
});

export default Resultstherapy;
