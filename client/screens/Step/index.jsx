import React from "react";
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

import HeaderLogo from "../HeaderLogo";

const StepScreen = ({ navigation }) => {
  const steps = [
    { id: 1, title: "เรียนรู้การจัดท่า\nในชีวิตประจำวัน", isFocus: true },
    { id: 2, title: "เคลื่อนไหว\nข้อต่อแขน", isFocus: false, round: "0/2" },
    { id: 3, title: "เคลื่อนไหว\nข้อต่อขา", isFocus: false, round: "0/2" },
    {
      id: 4,
      title: "การบริหาร\nฝึกกล้ามเนื้อสะโพก",
      isFocus: false,
      round: "0/2",
    },
    {
      id: 5,
      title: "เคลื่อนย้ายจาก\nเตียงไปรถเข็น",
      isFocus: false,
      round: "0/2",
    },
  ];

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
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepWrapper}>
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
                onPress={() =>
                  navigation.navigate("StepDetail", { id: step.id })
                }
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
                    ด่านที่ <Text style={{ fontSize: 28 }}> {step.id}</Text>
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
                      {step.title}
                    </Text>
                    {step.round && (
                      <Text
                        style={{
                          color: "#0081a2",
                          fontSize: 12,
                          marginTop: 10,
                        }}
                      >
                        รอบที่ {step.round}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
