import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Platform } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const monthNames = [
 "ทุกเดือน", "ม.ค", "ก.พ", "มี.ค", "เม.ย", "พ.ค", "มิ.ย",
  "ก.ค", "ส.ค", "ก.ย", "ต.ค", "พ.ย", "ธ.ค"
];

const TherapyFeedback = () => {
  const [authState] = useContext(AuthContext);

  // Data & loading
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort (เรียงลำดับ)
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // Month filter (ค่าตั้งต้น "all")
  const [monthFilter, setMonthFilter] = useState("all");
  // state เกี่ยวกับ DropDownPicker สำหรับเดือน (ไม่ใช้งานแล้ว แต่ยังคงไว้)
  const [monthOpen, setMonthOpen] = useState(false);

  // Filtered results
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

  // Search input
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation
  const navigation = useNavigation();

  // --- Custom Month Picker (Popup) ---
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  // เก็บปีในรูปแบบ พ.ศ. (เพิ่ม 543)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + 543);

  const openMonthPicker = () => setMonthPickerVisible(true);
  const closeMonthPicker = () => setMonthPickerVisible(false);

  const incrementYear = () => setSelectedYear((prev) => prev + 1);
  const decrementYear = () => setSelectedYear((prev) => prev - 1);

  // เมื่อเลือกเดือนจาก Popup (index: 0..11)
  const handleSelectMonth = (index) => {
    setMonthFilter(index === 0 ? "all" : index.toString()); // ✅ ถ้า index เป็น 0 ให้ใช้ "all"
  setMonthPickerVisible(false);
  };

  const resetFilters = () => {
    setSortOrder("newest"); // รีเซ็ตการเรียงลำดับ
    setMonthFilter("all"); // รีเซ็ตตัวกรองเดือน
    setSearchQuery(""); // รีเซ็ตช่องค้นหา
  };
  


  // --- ดึงข้อมูล feedbacks ---
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://10.0.2.2:8080/api/v1/feedbacks/user`, {
          params: { user_id: authState.user._id },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        if (!response.data.feedbacks || response.data.feedbacks.length === 0) {
          setError(null);
          setFeedbacks([]);
          setFilteredFeedbacks([]);
        } else {
          setFeedbacks(response.data.feedbacks);
          setFilteredFeedbacks(response.data.feedbacks);
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err.response || err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [authState]);

  // --- เรียงลำดับ + กรองข้อมูล (รวมทั้งกรองตามปีที่เลือกและเดือน) ---
  useEffect(() => {
    let filteredData = [...feedbacks];

    // กรอง feedback_type
    if (sortOrder === "good") {
      filteredData = filteredData.filter(item => item.feedback_type === "ทำได้ดี");
    } else if (sortOrder === "improve") {
      filteredData = filteredData.filter(item => item.feedback_type === "ควรปรับปรุง");
    }

    // เรียงตามวันที่
    if (sortOrder === "newest") {
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // กรองตามปี: ตรวจสอบ evaluation_date โดยแปลงปี AD เป็น พ.ศ. ด้วยการ +543
    filteredData = filteredData.filter(item => {
      const itemYear = new Date(item.evaluation_date).getFullYear() + 543;
      return itemYear === selectedYear;
    });

    // กรองตามเดือน (ถ้าไม่ได้เลือก "ทุกเดือน")
    if (monthFilter !== "all") {
      filteredData = filteredData.filter(item => {
        const itemMonth = new Date(item.evaluation_date).getMonth() + 1; // ✅ ใช้ getMonth() +1 เพื่อให้ตรงกับ array
        return itemMonth.toString() === monthFilter;
      });
    }
    

    setFilteredFeedbacks(filteredData);
  }, [sortOrder, feedbacks, monthFilter, selectedYear]);

  // --- ค้นหา ---
  useEffect(() => {
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.feedback_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.doctor_response.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  }, [searchQuery, feedbacks]);

  // --- Format วันที่ ---
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>ผลการประเมิน</Text>

     
        {/* ช่องค้นหา */}
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาผลการประเมิน..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
                <FontAwesome5 name="search" style={styles.searchIcon} />
        

        {/* Sort & Month Picker Row */}
        <View style={styles.pickerRow}>
          
          {/* Dropdown เรียงลำดับ (Sort) */}
          <View style={styles.dropdownContainer}>
          <Text style={styles.monthLabel}>กรองตาม :</Text>

            <DropDownPicker
              open={sortOpen}
              value={sortOrder}
              items={[
                { label: "วันที่ตอบกลับล่าสุด", value: "newest" },
                { label: "วันที่ตอบกลับเก่าที่สุด", value: "oldest" },
                { label: "ทำได้ดี", value: "good" },
                { label: "ควรปรับปรุง", value: "improve" },
              ]}
              setOpen={setSortOpen}
              setValue={setSortOrder}
              placeholder="เรียงลำดับ"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              listMode="SCROLLVIEW"
            />
          </View>

      

          {/* ปุ่มเลือกเดือน (แทน DropDownPicker เดิม) */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.monthLabel}>เดือน :</Text>
            <TouchableOpacity style={styles.monthSelectButton} onPress={() => setMonthPickerVisible(true)}>
  <Text style={styles.monthSelectButtonText}>
    {monthFilter === "all" ? "ทุกเดือน" : monthNames[Number(monthFilter)]}
  </Text>
</TouchableOpacity>

            
          </View>
          
        </View>

        

        {/* แสดงผล Feedbacks */}
        {filteredFeedbacks.length === 0 ? (
          <Text style={styles.noDataText}>ไม่พบผลการประเมินของท่าน</Text>
        ) : (
          <View>
            {filteredFeedbacks.map((feedback, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TherapyFeedbackDetail", {
                    feedback,
                    evaluation_date: feedback.evaluation_date,
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
                      feedback.feedback_type === "ทำได้ดี" ? styles.goodFeedback : styles.improveFeedback,
                    ]}
                  >
                    ผลการประเมิน: {feedback.feedback_type}
                  </Text>
                  <Text style={styles.cardText}>
                    ข้อความจากแพทย์: {feedback.doctor_response}
                  </Text>
                  <Text style={styles.cardText}>
                    ประเมินโดย :{" "}
                    {feedback.doctor_id
                      ? `${feedback.doctor_id.nametitle || ""} ${feedback.doctor_id.name || ""} ${feedback.doctor_id.surname || ""}`
                      : "ไม่ทราบชื่อแพทย์"}
                  </Text>
                  <Text style={styles.responseDate}>
                    ตอบกลับเมื่อ: {formatThaiDateWithTime(feedback.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal สำหรับเลือกเดือน (Popup 3x4) */}
      <Modal
        visible={isMonthPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMonthPicker}
      >

        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Header: ลูกศรซ้าย - ปี - ลูกศรขวา */}
            <View style={styles.modalHeader}>

              <TouchableOpacity onPress={decrementYear}>
                <FontAwesome5 name="chevron-left" size={18} color="#87CEFA" />
              </TouchableOpacity>

              <Text style={styles.modalYearText}>{selectedYear}</Text>
              <TouchableOpacity onPress={incrementYear}>
                <FontAwesome5 name="chevron-right" size={18} color="#87CEFA" />
              </TouchableOpacity>
            </View>

            {/* ตารางเดือน (3x4) */}
            <View style={styles.monthGrid}>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.monthCell}
                  onPress={() => handleSelectMonth(index)}
                >
                  <Text style={styles.monthCellText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ปุ่มปิด */}
            <TouchableOpacity style={styles.closeButton} onPress={closeMonthPicker}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  heading: {
    fontSize: 24,
    fontFamily: "Kanit",
    marginLeft: 20,
    borderLeftWidth: 3,
    paddingLeft: 10,
    borderColor: "#87CEFA",
    color: "#333",
    marginTop: 20,
  },
  scrollViewContent: { paddingBottom: 20 },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 10,
    padding: 10,
    margin: 18,
    textAlign: 'left', // ให้ placeholder และข้อความใน TextInput อยู่ทางขวา,
    paddingLeft:30

  },
  searchIcon: {
    position: 'absolute',
    left: 30,
    top: 90,
    color:"#565656"
  
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
  },
  dropdownContainer: {
    flex: 1, // ✅ ทำให้ตัวกรองมีขนาดเท่ากัน
    marginHorizontal: 10, // ✅ เพิ่มระยะห่างเล็กน้อยระหว่าง dropdowns
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#87CEFA",
    paddingHorizontal: 5,
    height: 42, // ✅ กำหนดความสูงให้แน่นอน (เช่นเดียวกับปุ่มเลือกเดือน)
    width: "100%",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#87CEFA",
    width: "100%", // ✅ ปรับให้ขนาดเท่ากัน

  },
 
  /* สไตล์สำหรับปุ่มเลือกเดือน (แทน DropDownPicker) */
  monthLabel: {
    fontFamily: "Kanit",
    fontSize: 14,
    color: "#333",
    margin:5
  },
  monthSelectButton: {
    backgroundColor: "white",
    borderRadius: 5,
    height: 40, // ✅ ปรับความสูงให้เท่ากับ DropDownPicker
    justifyContent: "center", // ✅ จัดให้อยู่ตรงกลาง
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#87CEFA",
    width: "60%", 
  },
  monthSelectButtonText: {
    fontFamily: "Kanit",
    fontSize: 16,
    color: "#333",
  },


  /* สไตล์สำหรับ Feedback Card */
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
  cardHeader: { backgroundColor: "#C2E8FF", padding: 15 },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: "Kanit",
    color: "#333",
  },
  cardContent: { padding: 15 },
  feedbackText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Kanit",
  },
  goodFeedback: { color: "#1DD345" },
  improveFeedback: { color: "orange" },
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
  noDataText: {
    textAlign: "center",
    marginTop: 200,
    fontSize: 20,
    fontFamily: "Kanit",
  },
  
  /* สไตล์ Modal สำหรับเลือกเดือน */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(167, 171, 171, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalYearText: {
    fontSize: 20,
    fontFamily: "Kanit",
    color: "#333",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthCell: {
    width: "30%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#C2E8FF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  monthCellText: {
    fontFamily: "Kanit",
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#87CEFA",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontFamily: "Kanit",
    fontSize: 16,
    color: "white",
  },

  
  
  
});

export default TherapyFeedback;
