import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const TherapyFeedback = () => {
  const [authState] = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // ใช้งาน useNavigation เพื่อจัดการการนำทาง

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://10.0.2.2:8080/api/v1/feedbacks/user`,
          {
            params: { user_id: authState.user._id },
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setFeedbacks(response.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [authState]);

  const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    const thaiYear = date.getFullYear() + 543;
    return `${date.toLocaleDateString("th-TH", options)} ${thaiYear}`;
  };

  const formatThaiDateWithTime = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    const thaiYear = date.getFullYear() + 543;
    const timeString = date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date.toLocaleDateString("th-TH", options)} ${thaiYear} เวลา ${timeString} น.`;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#87CEFA" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (feedbacks.length === 0) {
    return <Text style={styles.heading}>ไม่มีผลการประเมิน</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.heading}>ผลการประเมิน</Text>
        {feedbacks.map((feedback, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("TherapyFeedbackDetail", {
                feedback,
                evaluation_date: feedback.evaluation_date,  // เพิ่มการส่ง date ไปด้วย

              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>
                ผลการกายภาพบำบัด: {formatThaiDate(feedback.evaluation_date)}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.feedbackText,
                  feedback.feedback_type === "ทำได้ดี"
                    ? styles.goodFeedback
                    : styles.improveFeedback,
                ]}
              >
                ผลการประเมิน: {feedback.feedback_type}
              </Text>
              <Text style={styles.cardText}>
                ข้อความจากแพทย์: {feedback.doctor_response}
              </Text>
             <Text style={styles.cardText}>
  ประเมินโดย : {feedback.doctor_id
    ? `${feedback.doctor_id.nametitle || ''} ${feedback.doctor_id.name || ''} ${feedback.doctor_id.surname || ''}`
    : "ไม่ทราบชื่อแพทย์"}
</Text>

              <Text style={styles.responseDate}>
                ตอบกลับเมื่อ: {formatThaiDateWithTime(feedback.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontFamily: "Kanit",
    marginLeft: 20,
    borderLeftWidth: 3,
    paddingLeft: 10,
    borderColor: "#87CEFA",
    color: "#333",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  card: {
    marginTop: 30,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: "#C2E8FF",
    padding: 15,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: "Kanit",
    color: "#333",
  },
  cardContent: {
    padding: 15,
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Kanit",
  },
  goodFeedback: {
    color: "#1DD345",
  },
  improveFeedback: {
    color: "orange",
  },
  cardText: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: "Kanit",
    color: "#333",
  },
  responseDate: {
    fontSize: 14,
    marginTop: 10,
    color: "#666",
    fontFamily: "Kanit",
  },
});

export default TherapyFeedback;