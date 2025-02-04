import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
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
      // The screen is focused
      // Call any action

      handleGetMission();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const handleGetMission = async () => {
    try {
      const response = await axios.get("/mission/get-all-mission");

      if (response.status === 200) {
        setSteps(response.data.missions);
      }
    } catch (error) {
      console.log("err call api get question", error);
    }
  };

  const handleSelectMission = () => {
    // กรองเฉพาะ `_id` ของ mission ที่ `isEvaluatedToday = 0`
    let missionsToEvaluate = steps
      .filter((mission) => mission.isEvaluatedToday === 0)
      .map((mission) => mission._id);
    missionsToEvaluate = missionsToEvaluate.filter(
      (missionId) => missionId !== isSelectedMission.selectedMissionId
    );

    // นำทางไปยังหน้าถัดไป พร้อมส่ง `_id` ของ mission ที่ถูกเลือกและ `_id` ของรายการที่ต้องประเมิน
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
    <LinearGradient
      colors={["#FFFFFF", "#baefff"]} // ไล่สีจากฟ้าจางไปขาว
      style={styles.gradient}
    >
      <View style={{ marginBottom: 60 }}>
        <View style={styles.containerHeader}>
          <HeaderLogo />
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome5 name="chevron-left" color="#6bdbfc" size={18} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
          {steps?.length > 0 &&
            steps.map((step, index) => (
              <View key={step._id} style={styles.stepWrapper}>
                {/* เส้นเฉียง */}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.diagonalLine,
                      index % 2 === 0 ? styles.lineLeft : styles.lineRight,
                    ]}
                  />
                )}
                {/* วงกลม */}
                <TouchableOpacity
                  onPress={() => toggleModal(step)}
                  style={[
                    styles.stepContainer,
                    index % 2 === 0 ? styles.stepRight : styles.stepLeft,
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.stepNumber,
                        { textAlign: index % 2 === 0 ? "left" : "right" },
                      ]}
                    >
                      ด่านที่ <Text style={{ fontSize: 28 }}> {step.no}</Text>
                    </Text>
                    <View
                      style={[
                        styles.circle,
                        {
                          backgroundColor: step.isFocus ? "#64dafc" : "white",
                          borderColor: step.isFocus ? "white" : "#64dafc",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepTitle,
                          { color: step.isFocus ? "white" : "#0081a2" },
                        ]}
                      >
                        {step.name}
                      </Text>
                      {step.isEvaluate && (
                        <Text
                          style={{
                            color: "#0081a2",
                            fontSize: 12,
                            marginTop: 10,
                          }}
                        >
                          รอบที่ {step.isEvaluatedToday} / 1
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
        <MissionModal
          visible={isModalVisible}
          mission={isSelectedMission}
          onClose={() => setModalVisible(false)}
          onStart={() => handleSelectMission()}
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
  },
  backButton: {
    marginLeft: 10,
  },
  stepWrapper: {
    position: "relative",
    marginBottom: 40,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepLeft: {
    justifyContent: "flex-end",
    paddingRight: 20,
  },
  stepRight: {
    justifyContent: "flex-start",
    paddingLeft: 20,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008cb7",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  diagonalLine: {
    position: "absolute",
    width: 190,
    height: 5,
    backgroundColor: "#aa875f",
    zIndex: -1,
  },
  lineLeft: {
    top: 210, // ระยะจากด้านบน
    left: 120, // ระยะจากด้านซ้าย
    transform: [{ rotate: "45deg" }],
  },
  lineRight: {
    top: 210, // ระยะจากด้านบน
    right: 120, // ระยะจากด้านขวา
    transform: [{ rotate: "-45deg" }],
  },
});

export default StepScreen;
