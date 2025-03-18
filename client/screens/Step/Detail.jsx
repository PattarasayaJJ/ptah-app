import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvaluationModal from "../../components/EvaluationModal";
import SuccessModal from "../../components/SuccessModal";
import HeaderLogo from "../HeaderLogo";

const { width, height } = Dimensions.get("window");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const StepDetailScreen = ({ navigation, route }) => {
  const btn = ["วิดีโอ", "รูปภาพ"];
  const videoRef = useRef(null);
  const [missionDetail, setMissionDetail] = useState({});
  const [subMissionLength, setSubMissionLength] = useState(0);
  const [maxSubMissionLength, setMaxSubMissionLength] = useState(0);
  const [isSelected, setIsSelected] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluated, setEvaluated] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    handleGetMissionDetail();
  }, [route.params.id]);

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleGetMissionDetail = async () => {
    try {
      setIsLoading(true);
      setSubMissionLength(0);
      setAnswers([]);

      const response = await axios.get(
        `/mission/get-mission/${route.params.id}`
      );

      if (response.status === 200) {
        setMissionDetail(response.data.data);
        setMaxSubMissionLength(response.data.data.submissions.length);
        setIsRunning(response.data.data.mission.isEvaluate);
        setEvaluated(
          (response.data.data.mission.isEvaluate &&
            route.params.isEvaluatedToday === 0) ||
            route.params.isEvaluatedToday === undefined
            ? true
            : false
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log("err call api get question", error);
      setIsLoading(false);
    }
  };

  const handleConditionNext = () => {
    if (maxSubMissionLength === subMissionLength + 1) {
      if (missionDetail?.submissions[subMissionLength]?.evaluate) {
        if (route.params.isEvaluatedToday === 1) {
          navigation.goBack();
        } else {
          toggleModal();
        }
      } else {
        if (route.params.missionsToEvaluate.length > 0) {
          let missionsToEvaluate = route.params.missionsToEvaluate;
          const id = missionsToEvaluate.shift();

          navigation.setParams({
            id: id,
            missionsToEvaluate,
          });
        } else {
          navigation.goBack();
        }
      }
    } else {
      if (missionDetail?.submissions[subMissionLength]?.evaluate) {
        if (evaluated) {
          toggleModal();
        } else {
          setSubMissionLength((prev) => prev + 1);
        }
      } else {
        setSubMissionLength((prev) => prev + 1);
      }
    }
  };

  const toggleModal = () => {
    setIsRunning((prev) => (prev ? false : true));
    setModalVisible((prev) => (prev ? false : true));
  };

  const handleSelectLevel = async (level) => {
    const newAnswers = [
      ...answers,
      { name: missionDetail.submissions[subMissionLength].name, result: level },
    ];
    setAnswers(newAnswers);

    if (maxSubMissionLength !== subMissionLength + 1) {
      setSubMissionLength((prev) => prev + 1);
    } else {
      await delay(500);
      setIsRunning((prev) => (prev ? false : true));
      setModalVisible2(true);
    }
  };

  const onCloseSuccess = () => {
    setModalVisible2(false);

    navigation.navigate("Resultstherapy", {
      answers,
      time,
      missionId: route.params.id,
      missionsToEvaluate: route.params.missionsToEvaluate,
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#baefff"]} style={styles.gradient}>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0096bd" />
            <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
          </View>
        ) : (
          <View>
            {evaluated && (
              <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                <Text style={styles.stepNumber}>
                  <FontAwesome5 name="stopwatch" color="#6bdbfc" size={18} />
                  <Text style={{ fontSize: 18, color: "#6bdbfc" }}>
                    {" "}
                    {formatTime(time)}
                    {" น."}
                  </Text>
                </Text>
              </View>
            )}
            <View style={styles.container}>
              <Text style={styles.stepNumber}>
                ด่านที่
                <Text style={{ fontSize: 28 }}>
                  {" "}
                  {missionDetail?.mission?.no}
                </Text>
              </Text>
              <Text style={styles.stepNumber}>
                {missionDetail.submissions
                  ? missionDetail?.submissions[subMissionLength]?.name
                  : ""}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {btn.map((value, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setIsSelected(idx)}
                    style={[
                      styles.tabBtn,
                      {
                        backgroundColor:
                          isSelected === idx ? "#64dafc" : "white",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: isSelected === idx ? "white" : "black",
                      }}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ marginTop: 30 }}>
                {isSelected === 0 ? (
                  <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{
                      uri: missionDetail.submissions
                        ? missionDetail?.submissions[subMissionLength]?.videoUrl
                        : "",
                    }}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setImageModalVisible(true)}
                  >
                    <Image
                      style={[styles.img]}
                      source={{
                        uri: missionDetail.submissions
                          ? missionDetail?.submissions[
                              subMissionLength
                            ]?.imageUrl
                          : "",
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        <View
          style={{ marginTop: 60, marginRight: 20, alignItems: "flex-end" }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => handleConditionNext()}
          >
            <View></View>
            <Text style={styles.nextButtonText}>ต่อไป</Text>
            <FontAwesome5 name="chevron-right" color="#0096bd" size={18} />
          </TouchableOpacity>
        </View>
      </View>
      <EvaluationModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        onSelectLevel={handleSelectLevel}
        missionDetail={missionDetail}
        subMissionLength={subMissionLength}
        time={time}
      />
      <SuccessModal
        isVisible={isModalVisible2}
        onCloseSuccess={() => onCloseSuccess()}
        time={time}
      />
      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <FontAwesome5 name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            style={styles.expandedImage}
            source={{
              uri: missionDetail.submissions
                ? missionDetail?.submissions[subMissionLength]?.imageUrl
                : "",
            }}
          />
        </View>
      </Modal>
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
    paddingVertical: 10,
    alignItems: "center",
  },
  backButton: {
    marginLeft: 10,
  },
  tabBtn: {
    width: 80,
    padding: 10,
    marginLeft: 10,
    borderRadius: 7,
  },
  stepNumber: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    fontFamily: "Kanit",
  },
  video: {
    width: width * 0.9,
    height: height * 0.32,
    borderRadius: 10,
  },
  img: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 10,
    alignSelf: "center",
  },
  nextButton: {
    padding: 10,
    borderRadius: 25,
    width: 150,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#0096bd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextButtonText: {
    color: "#0096bd",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#0096bd", fontSize: 16, marginTop: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  expandedImage: {
    width: width * 0.9,
    height: height * 0.7,
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default StepDetailScreen;
