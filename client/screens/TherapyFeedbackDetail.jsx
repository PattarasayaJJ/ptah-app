import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const TherapyFeedbackDetail = ({ route }) => {
    const { feedback, evaluation_date } = route.params;
    const [authState] = useContext(AuthContext);
    const [evaluations, setEvaluations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const formatDateThai = (dateString) => {
        const options = { day: "numeric", month: "long" };
        const date = new Date(dateString);
        const thaiYear = date.getFullYear() + 543; // เพิ่ม 543 เพื่อแปลง ค.ศ. เป็น พ.ศ.
        const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(date);
        return `${formattedDate} ${thaiYear}`;
    };


    const getFeedbackColor = (feedback) => {
        switch (feedback) {
            case "ทำได้ดี":
                return "#1DD345";
            case "ควรปรับปรุง":
                return "#E88B00";
            default:
                return "black";
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case "ง่าย":
                return "#1DD345";
            case "ปานกลาง":
                return "#E88B00";
            case "ยาก":
                return "#FF6A6A";
            default:
                return "black";
        }
    };



    useEffect(() => {
        if (!evaluation_date) {
            setError("❌ ไม่พบวันที่ประเมิน");
            setLoading(false);
            return;
        }

       

        const formattedDate = new Date(evaluation_date).toISOString().split("T")[0];

        const fetchEvaluations = async () => {
            try {
                const response = await axios.post("http://10.0.2.2:8080/api/v1/evaluation", {
                    user_id: authState?.user?._id,
                    date: formattedDate,
                });

                if (Array.isArray(response.data)) {
                    setEvaluations(response.data);
                } else {
                    setError("❌ รูปแบบข้อมูลผิดพลาด");
                }
            } catch (err) {
                console.log("🚨 API Error:", err.response?.data || err.message);
                setEvaluations([]); // ❗ ถ้าไม่มีข้อมูล ก็ให้ evaluations เป็น [] (ว่าง) แทน error
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, [evaluation_date]);

    if (loading) return <ActivityIndicator size="large" color="#87CEFA" />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.heading}>รายละเอียดการประเมิน</Text>
            <Text style={styles.date}>วันที่ {formatDateThai(evaluation_date)}</Text>

            {/* ✅ แสดงข้อมูล Feedback จากแพทย์เสมอ */}
            <View style={styles.feedbackContainer}>
            <View style={styles.feedbackHeader}>
                    <Text style={styles.feedbackTitle}>ผลการประเมินจากแพทย์</Text>
                    </View>
                <Text style={[styles.feedbackText, { color: getFeedbackColor(feedback.feedback_type) }]}>
                    ผลการประเมิน : {feedback.feedback_type}
                </Text>
                <Text style={styles.text}>ข้อความจากแพทย์ : {feedback.doctor_response}</Text>
             <Text style={styles.text}>
              ประเมินโดย : {feedback.doctor_id
                ? `${feedback.doctor_id.nametitle || ''} ${feedback.doctor_id.name || ''} ${feedback.doctor_id.surname || ''}`
                : "ไม่ทราบชื่อแพทย์"}
            </Text>
            
            </View>

            {/* ✅ ถ้ามีข้อมูลการประเมิน ให้แสดง */}
            {evaluations && evaluations.length > 0 ? (
                evaluations.map((evaluation, index) => (
                    <View key={index} style={styles.evaluationContainer}>
                      <View style={styles.evaluationHeader}>
                            <Text style={styles.subHeading}>ผลกายภาพบำบัดที่ {index + 1}</Text>
                        </View>
                        {evaluation.answers.map((answer, idx) => (
                            <View key={idx} style={styles.answerRow}>
                                <Text style={styles.answerName}>{answer.name}</Text>
                                <Text style={styles.answerResult}>{answer.result}</Text>
                            </View>

                        ))}

<Text style={styles.textbox}>ข้อความถึงแพทย์ : {evaluation.suggestion || "-"}
</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noneva}>ท่านไม่ได้ทำกายภาพบำบัดในวันนี้</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "white" },
    heading: {
        fontSize: 24,
        fontFamily: "Kanit",
        borderLeftWidth: 3,
        paddingLeft: 10,
        borderColor: "#87CEFA",
        color: "#333",
        marginBottom: 5,
    },
    dateText: { fontSize: 16, textAlign: "center", marginBottom: 15, color: "#555", fontFamily: "Kanit" },

    feedbackContainer: {
        marginVertical: 10,
        borderRadius: 15,
        marginHorizontal: 1,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    feedbackHeader: {
        backgroundColor: "#C2E8FF",
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    feedbackTitle: { fontSize: 16, textAlign: "center", fontFamily: "Kanit", color: "#333" },
    feedbackText: { fontSize: 15, fontFamily: "Kanit", padding: 15, lineHeight: 15,  }, // เพิ่ม lineHeight
    text: { fontSize: 15, fontFamily: "Kanit", padding: 15, lineHeight: 10 }, // เพิ่ม lineHeight

    evaluationContainer: {
        marginVertical: 10,
        borderRadius: 15,
        marginHorizontal: 1,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    evaluationHeader: {
        backgroundColor: "#C2E8FF",
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    subHeading: { fontSize: 16, textAlign: "center", fontFamily: "Kanit", color: "#333" },
    answerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    answerName: { fontSize: 15, fontFamily: "Kanit", color: "#333" },
    answerResult: { fontSize: 15, fontFamily: "Kanit" },
    textbox: { 
        fontSize: 15, 
        fontFamily: "Kanit", 
        padding: 10, 
        lineHeight: 20, // ลดระยะห่างระหว่างบรรทัด
    },
    date: {
        fontSize: 18,
        fontFamily: "Kanit",
        paddingLeft: 12,
        marginBottom: 15,
    },
    noneva:{
        textAlign:"center",
        marginTop:30,
        fontSize: 15, fontFamily: "Kanit", color: "red"
    }
});



export default TherapyFeedbackDetail;
