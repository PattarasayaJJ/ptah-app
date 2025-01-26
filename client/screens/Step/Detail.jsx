import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image,
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
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    handleGetMissionDetail();
  }, []);
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
      const response = await axios.get(
        `/mission/get-mission/${route.params.id}`
      );

      if (response.status === 200) {
        console.log("response", response.data);

        setMissionDetail(response.data.data);
        setMaxSubMissionLength(response.data.data.submissions.length);
      }
    } catch (error) {
      console.log("err call api get question", error);
    }
  };

  const handleConditionNext = () => {
    if (maxSubMissionLength === subMissionLength + 1) {
      if (missionDetail?.submissions[subMissionLength]?.evaluate) {
        // call function send all evaluate
        console.log("111");
        // console.log("answers", answers);
        toggleModal();
      } else {
        console.log("112");
        navigation.goBack();
      }
    } else {
      if (missionDetail?.submissions[subMissionLength]?.evaluate) {
        // open pop up evaluate
        console.log("113");
        toggleModal();
      } else {
        console.log("114");
        setSubMissionLength((prev) => prev + 1);
      }
    }
  };

  const toggleModal = () => {
    setIsRunning(!isRunning);
    setModalVisible(!isModalVisible);
  };

  // รับค่าระดับการประเมินจาก Modal
  const handleSelectLevel = async (level) => {
    console.log("ระดับที่เลือก:", level);
    const newAnswers = [
      ...answers,
      { name: missionDetail.submissions[subMissionLength].name, result: level },
    ];
    setAnswers(newAnswers);
    console.log("newAnswers:", newAnswers);
    if (maxSubMissionLength !== subMissionLength + 1) {
      setSubMissionLength((prev) => prev + 1);
    } else {
      await delay(500);
      setModalVisible2(true);
    }
  };

  const onCloseSuccess = () => {
    console.log("sdsdsdsds");
    setModalVisible2(false);
    navigation.navigate("Resultstherapy", {
      answers,
      time,
      missionId: route.params.id,
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
        {missionDetail.submissions &&
          missionDetail?.submissions[subMissionLength]?.evaluate && (
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
            <Text style={{ fontSize: 28 }}> {missionDetail?.mission?.no}</Text>
          </Text>
          <Text style={styles.stepNumber}>
            {missionDetail.submissions
              ? missionDetail.submissions[subMissionLength].name
              : ""}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {btn.map((value, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setIsSelected(idx)}
                style={[
                  styles.tabBtn,
                  { backgroundColor: isSelected === idx ? "#64dafc" : "white" },
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
                useNativeControls // Enables play/pause and other controls
                resizeMode="cover" // Adjusts how the video is scaled
                isLooping // Makes the video loop
              />
            ) : (
              <Image
                style={[styles.video, { resizeMode: "contain" }]}
                source={{
                  uri: missionDetail.submissions
                    ? missionDetail?.submissions[subMissionLength]?.photoUrl
                    : "",
                }}
              />
            )}
          </View>
        </View>
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
    borderRadius: 14,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  video: {
    width: width * 0.9,
    height: height * 0.32,
    borderRadius: 10,
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
});

export default StepDetailScreen;
