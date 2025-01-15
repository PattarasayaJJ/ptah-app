import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const SurveyScreen = ({ navigation, questions, updateSurveyStatus }) => {
  const [authState] = useContext(AuthContext);
  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers([...answers, selectedOption]);

      setIdx((prev) => prev + 1);

      // Navigate to the next screen or perform an action
    } else {
      alert("Please select an option.");
    }
  };

  const handleSendAnswers = async () => {
    const newAnswers = [...answers, selectedOption];

    const data = {
      userId: authState.user._id,
      answers: newAnswers,
    };

    const response = await axios.post("/answer/send-answer", data);

    if (response.status === 201) {
      updateSurveyStatus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome5 name="chevron-left" color="#6bdbfc" size={18} />
      </TouchableOpacity>

      <View style={styles.cardQuestion}>
        {/* Header Image */}
        <View style={{ marginLeft: -37 }}>
          <Image
            source={require("../../img/question.png")} // Replace with your image URL or local asset
            style={styles.image}
          />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questions[idx]?.name}</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {questions[idx]?.choice.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              //   selectedOption === index + 1 && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(option)}
          >
            <Text style={styles.optionText}>{index + 1} </Text>
            <Text style={styles.optionText}>{option?.name}</Text>
            <FontAwesome5
              name="circle"
              solid
              color={selectedOption?.name === option.name ? "green" : "white"}
              size={18}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={{ marginTop: 60, alignItems: "flex-end" }}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            questions.length === idx + 1 ? handleSendAnswers() : handleNext()
          }
        >
          <View></View>
          <Text style={styles.nextButtonText}>ต่อไป</Text>
          <FontAwesome5 name="chevron-right" color="#0096bd" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  cardQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#b8eeff",
    borderRadius: 20,
    padding: 10,
  },
  image: {
    width: 100,
    height: 160,
  },
  questionContainer: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#008cb7",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedOption: {
    backgroundColor: "#0E76A8",
  },
  optionText: {
    fontSize: 16,
    color: "white",
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

export default SurveyScreen;
