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
import { Video } from "expo-av";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvaluationModal from "../../components/EvaluationModal";
import SuccessModal from "../../components/SuccessModal";
import { Alert } from "react-native";  // ✅ นำเข้า Alert จาก react-native

const { width, height } = Dimensions.get("window");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const StepDetailScreen = ({ navigation, route }) => {
  const btn = ["รูปภาพ", "วีดีโอ"];
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

  const handleGoBack = () => {
    if (isRunning && !route.params.isEvaluatedToday) {
    Alert.alert(
      "แจ้งเตือน",
      "หากออกจากด่าน เวลาจะเริ่มนับใหม่ คุณแน่ใจหรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ออก",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  } else {
    navigation.goBack();
  }
};

  return (
    <View style={styles.gradient}>
      <View style={{ marginBottom: 0 }}> 
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
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
                          isSelected === idx ? "#66C4FF" : "white",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: isSelected === idx ? "white" : "#66C4FF",
                      }}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ marginTop: 20 }}>
                {isSelected === 1 ? (
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
                      <Text style={styles.imageDescription}>กดที่รูปเพื่อขยาย</Text>

                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        <View
          style={{ marginTop: 30, marginRight: 25, alignItems: "flex-end" }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => handleConditionNext()}
          >
            <View></View>
            <Text style={styles.nextButtonText}>ต่อไป</Text>
            <FontAwesome5 name="chevron-right" color="white" size={16} />
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
            <FontAwesome5 name="times" size={18} color="#87CEFA" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor:"white"
  },
  containerHeader: {
    marginTop: Platform.OS === "ios" ? 60 : 30,
    alignItems: "center",
  },
  container: {
    paddingVertical: 8,
    alignItems: "center",
  },
  backButton: {
    marginLeft: 30,
  },
  tabBtn: {
    width: 80,
    padding: 10,
    marginLeft: 10,
    borderRadius: 7,
    borderColor:"#87CEFA",
    borderWidth:1
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
  width: "100%", // ให้รูปภาพเต็มความกว้างของคอนเทนเนอร์
  height: undefined, // ให้คำนวณอัตราส่วนอัตโนมัติ
  aspectRatio: 1, // หรือ aspectRatio คำนวณจากขนาดภาพจริง
  borderRadius: 10,
  alignSelf: "center",
  resizeMode: "contain", // ให้ภาพพอดีกับพื้นที่โดยไม่ถูกบีบ
},
  nextButton: {
    padding: 12,
    borderRadius: 24,
    width: 100,
    backgroundColor: "#66C4FF",    
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextButtonText: {
    color: "#fff",
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
  imageDescription: {
    marginTop: 8, // เว้นระยะห่างจากรูปภาพ
    fontSize: 14,
    color: "#555", // สีเทาอ่อนเพื่อให้อ่านง่าย
    textAlign:"center"
  },
  
});

export default StepDetailScreen;
