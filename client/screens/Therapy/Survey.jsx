import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Progress from "react-native-progress"; // ✅ Import Progress Bar


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

  const handlePrev = () => {
    if (idx > 0) {
      setIdx((prev) => prev - 1);
      setSelectedOption(answers[idx - 1] || null); // ดึงคำตอบก่อนหน้า
      setAnswers((prev) => prev.slice(0, -1)); // ลบคำตอบล่าสุด
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
            {/* 🔥 Progress Bar */}
            <View style={styles.progressContainer}>
        <Progress.Bar
          progress={(idx + 1) / questions.length}
          width={360} // ✅ ความกว้างของ Progress Bar
          color="#66C4FF" // ✅ สีฟ้า
          height={10} // ✅ ความสูง
          borderRadius={5} // ✅ ขอบโค้ง
        />
        <Text style={styles.progressText}>
          คำถามที่ {idx + 1} / {questions.length}
        </Text>
      </View>

     
      

      <View style={styles.cardQuestion}>
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
              name="heart"
              solid
              color={selectedOption?.name === option.name ? "#ED3838" : "white"}
              size={18}
            />
          </TouchableOpacity>
        ))}
      </View>

      
      {/* ปุ่มถัดไป & ย้อนกลับ */}
      <View style={styles.buttonContainer}>
  {/* ปุ่มย้อนกลับ */}
  {idx > 0 ? (
    <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
      <FontAwesome5 name="chevron-left" color="#66C4FF" size={18} />
      <Text style={styles.prevButtonText}>ย้อนกลับ</Text>
    </TouchableOpacity>
  ) : (
    <View style={{ flex: 1 }} /> // ✅ เพิ่ม View เปล่าแทนที่ปุ่มย้อนกลับ (ดันปุ่มต่อไปไปขวา)
  )}

  {/* ปุ่มถัดไป */}
  <TouchableOpacity
    style={styles.nextButton}
    onPress={() =>
      questions.length === idx + 1 ? handleSendAnswers() : handleNext()
    }
  >
    <Text style={styles.nextButtonText}>
      ต่อไป
    </Text>
    <FontAwesome5 name="chevron-right" color="white" size={18} />
  </TouchableOpacity>
</View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 15,
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
    marginTop:5,
    
  },
  questionText: {
    fontSize: 25,
    color: "#333",
    fontFamily: "Kanit",
    

    
  },
  optionsContainer: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
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
    color: "#333",
    fontFamily: "Kanit",

  },
  nextButton: {
    padding: 12,
    borderRadius: 30,
    width: 85,
    backgroundColor: "#66C4FF",    
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit",

  },
  prevButton: {
    padding: 12,
    borderRadius: 24,
    width: 120,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth:1,
    borderColor:"#66C4FF"
  },
  prevButtonText: {
    color: "#66C4FF",
    fontSize: 16,
    fontFamily: "Kanit",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  progressText: {
    fontSize: 18,
    color: "#66C4FF",
    textAlign: "center",
    marginBottom: 15, // ✅ เพิ่มระยะห่างจากคำถาม
    fontFamily: "Kanit",
    marginTop: 10,

    
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 5,
  },

});

export default SurveyScreen;
