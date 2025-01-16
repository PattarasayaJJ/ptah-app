import React, { useRef, useState } from "react";
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

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import HeaderLogo from "../HeaderLogo";

const { width, height } = Dimensions.get("window");

const StepDetailScreen = ({ navigation, route }) => {
  const btn = ["วิดีโอ", "รูปภาพ"];
  const videoRef = useRef(null);
  const [isSelected, setIsSelected] = useState(0);
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
        <View style={styles.container}>
          <Text style={styles.stepNumber}>
            ด่านที่ <Text style={{ fontSize: 28 }}> {route.params.id}</Text>
          </Text>
          <Text style={styles.stepNumber}>ท่านอนตะแคงทับข้างดี</Text>
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
                  uri: "https://firebasestorage.googleapis.com/v0/b/ptahproject-3a7d3.appspot.com/o/postures%2F1%2Fvideos%2F0_IMG_6834.MOV?alt=media&token=714f168f-751e-4463-a116-d1055093382e", // Replace with your video URL
                }}
                useNativeControls // Enables play/pause and other controls
                resizeMode="cover" // Adjusts how the video is scaled
                isLooping // Makes the video loop
              />
            ) : (
              <Image
                style={[styles.video, { resizeMode: "contain" }]}
                source={{
                  uri: "https://firebasestorage.googleapis.com/v0/b/ptahproject-3a7d3.appspot.com/o/postures%2F676921a6b28f4d2dfc42614a%2Fimages%2F0_%E0%B8%94%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%881.1%20%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%99%E0%B8%AB%E0%B8%87%E0%B8%B2%E0%B8%A2.png?alt=media&token=94a7c851-0e72-42ea-8745-2d9fb90745c9",
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
            onPress={() => navigation.goBack()}
          >
            <View></View>
            <Text style={styles.nextButtonText}>ต่อไป</Text>
            <FontAwesome5 name="chevron-right" color="#0096bd" size={18} />
          </TouchableOpacity>
        </View>
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
    paddingVertical: 80,
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
