import React, { useContext, useEffect, useState } from "react";

import { View, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderLogo from "../HeaderLogo";
import SurveyScreen from "./Survey";
import SuccessCardScreen from "./SuccessCard";

const Therapy = ({ navigation }) => {
  const [authState] = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [isSurvey, setIsSurvey] = useState(null);

  useEffect(() => {
    getData();
    handleGetQuestion();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(
        `isSurvey_${authState.user._id}`
      );

      setIsSurvey(value != null || value === "yes" ? true : false);
    } catch (e) {
      // error reading value
      console.log("error get data", e);
    }
  };

  const handleGetQuestion = async () => {
    try {
      const response = await axios.get("/question/get-all-questions");

      if (response.status === 200) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.log("err call api get question", error);
    }
  };

  // Callback to update `isSurvey`
  const updateSurveyStatus = async () => {
    try {
      await AsyncStorage.setItem(`isSurvey_${authState.user._id}`, "yes");
      setIsSurvey(true);
    } catch (e) {
      console.log("error updating survey status", e);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#baefff"]} // ไล่สีจากฟ้าจางไปขาว
      style={styles.gradient}
    >
      <View>
        <View style={styles.container}>
          <HeaderLogo></HeaderLogo>
        </View>
        {isSurvey === null || !isSurvey ? (
          <SurveyScreen
            navigation={navigation}
            questions={questions}
            updateSurveyStatus={updateSurveyStatus}
          ></SurveyScreen>
        ) : (
          <SuccessCardScreen navigation={navigation}></SuccessCardScreen>
        )}
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    marginTop: Platform.OS === "ios" ? 60 : 30,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#D9EFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#0E76A8",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Therapy;
