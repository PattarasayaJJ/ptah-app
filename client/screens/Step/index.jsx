import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import MissionModal from "../../components/MissionModal";
import HeaderLogo from "../HeaderLogo";

const StepScreen = ({ navigation }) => {
  const [steps, setSteps] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelectedMission, setIsSelectedMission] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleGetMission();
    });

    return unsubscribe;
  }, [navigation]);

  const handleGetMission = async () => {
    try {
      const response = await axios.get("/mission/get-all-mission");
      if (response.status === 200) {
        setSteps(response.data.missions);
      }
    } catch (error) {
      console.log("Error fetching missions", error);
    }
  };

  const handleSelectMission = () => {
    let missionsToEvaluate = steps
      .filter((mission) => mission.isEvaluatedToday === 0)
      .map((mission) => mission._id);

    missionsToEvaluate = missionsToEvaluate.filter(
      (missionId) => missionId !== isSelectedMission._id
    );

    setModalVisible(false);
    navigation.navigate("StepDetail", {
      id: isSelectedMission._id,
      missionsToEvaluate,
      isEvaluatedToday: isSelectedMission.isEvaluatedToday,
    });
  };

  const toggleModal = (step) => {
    setModalVisible(true);
    setIsSelectedMission(step);
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.gradient}>

      <View style={{ marginBottom: 60 }}>
        
        <ScrollView contentContainerStyle={styles.container}>

          {steps?.length > 0 &&
            steps.map((step) => (
              <TouchableOpacity
              key={step._id}
              onPress={() => toggleModal(step)}
              disabled={
                step.no >= 3 && // เริ่มล็อกตั้งแต่ด่านที่ 3 เป็นต้นไป
                !steps.find((s) => s.no === step.no - 1)?.isEvaluatedToday // ถ้าด่านก่อนหน้าไม่ได้ทำ
              }
              style={[
                styles.stepCard,
                step.no === 1 ? styles.firstStepCard : null,
                step.no >= 3 && // ทำให้ด่านที่ล็อกอยู่ดูจางลง (เฉพาะด่านที่ 3 ขึ้นไป)
                !steps.find((s) => s.no === step.no - 1)?.isEvaluatedToday
                  ? { opacity: 0.5 }
                  : {},
              ]}
            >
            
                
                <View style={styles.stepHeader}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styles.stepNumber}>{step.no}</Text>
    <Text style={styles.stepTitle}>{step.name}</Text>
  </View>
  {step.no !== 1 && (
    <Text
      style={[
        styles.progressText,
        { color: step.isEvaluatedToday === 1 ? "#4caf50" : "#bdbdbd" },
      ]}
    >
      {step.isEvaluatedToday === 1 ? "ทำแล้ว" : "ยังไม่ทำ"}
    </Text>
  )}
</View>

                
              </TouchableOpacity>
            ))}
        </ScrollView>
        <MissionModal
          visible={isModalVisible}
          mission={isSelectedMission}
          onClose={() => setModalVisible(false)}
          onStart={handleSelectMission}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  containerHeader: {
    marginTop: Platform.OS === "ios" ? 60 : 30,
    alignItems: "center",
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    marginLeft: 10,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  firstStepCard: {
    backgroundColor: "#DCF0FC",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    height:100,
    justifyContent: "center", // จัดให้อยู่ตรงกลางแนวตั้ง

    
  },
 stepHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // ทำให้ ProgressBar อยู่ฝั่งขวา
  marginBottom: 10,
},

  stepNumber: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#008cb7",
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Kanit",
    fontSize:18,

  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    marginRight: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#555",
  },
});

export default StepScreen;
