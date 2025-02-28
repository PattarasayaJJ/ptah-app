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


  const getOptionColor = (optionName) => {
    const greenOptions = ["มาก", "พร้อมแล้ว", "ดีขึ้นมาก"];
    const orangeOptions = ["ปานกลาง", "ดีขึ้น"];
    const redOptions = ["น้อย", "ยังไม่พร้อม","เฉยๆ"];

    if (greenOptions.includes(optionName)) return "#ADFFBF";
    if (orangeOptions.includes(optionName)) return "#FFCC7F";
    if (redOptions.includes(optionName)) return "#FEA9A9";

    return "#ffffff";
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers([...answers, selectedOption]);
      setIdx((prev) => prev + 1);
      setSelectedOption(null);  // รีเซ็ต selectedOption สำหรับคำถามถัดไป
    } else {
      alert("กรุณาเลือกคำตอบ");
    }
  };

  const handleSendAnswers = async () => {
    if (!selectedOption) {
      alert("กรุณาเลือกคำตอบ");
      return;
    }
  
    const newAnswers = [...answers, selectedOption];
  
    try {
      const response = await axios.post("/answer/send-answer", {
        userId: authState.user._id,
        answers: newAnswers,
      });
  
      if (response.status === 201) {
        updateSurveyStatus();
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Back Button */}

   { /* <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome5 name="chevron-left" color="#6bdbfc" size={18} />
      </TouchableOpacity> */}
      

      <View style={styles.cardQuestion}>
        {/* Header Image */}
       

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
         { backgroundColor: getOptionColor(option.name) },
         selectedOption?.name === option.name && styles.selectedOption,
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
   
  },
  
  questionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom:100,
    marginTop:20
  },
  questionText: {
    fontSize: 25,
    color: "#333",
  },
  optionsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  optionText: {
    fontSize: 16,
    color: "black",
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
