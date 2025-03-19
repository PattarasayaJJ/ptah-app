import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import axios from "axios";
import { AuthContext } from "../context/authContext";

// 🔹 กำหนดให้ react-native-calendars ใช้ภาษาไทย
LocaleConfig.locales["th"] = {
  monthNames: [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ],
  monthNamesShort: [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ],
  dayNames: [
    "วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ",
    "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"
  ],
  dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]
};
LocaleConfig.defaultLocale = "th";

const History = () => {
  const [authState] = useContext(AuthContext);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = authState?.user?._id;

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!userId) {
        console.warn("❌ ไม่พบ user ID, แสดงปฏิทินที่ว่างเปล่า");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://10.0.2.2:8080/api/v1/main/datacalendar/${userId}`,
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          }
        );

        console.log("📌 ข้อมูลที่ได้รับจาก API:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
        }

        const newMarkedDates = {};
        const today = new Date().toISOString().split("T")[0];

        response.data.forEach((item) => {
          const dateKey = item.date;
          const showStar = Boolean(item.star);
          let textColor = "#0096FF";

          if (dateKey > today) {
            textColor = "gray";
          } else if (item.status === "notsent") {
            textColor = "#93C5FD";
          } else if (item.status === 0) {
            textColor = "#1DD345";
          } else if (item.status === 1) {
            textColor = "orange";
          }

          newMarkedDates[dateKey] = {
            showStar: showStar,
            customStyles: {
              container: { flexDirection: "column", alignItems: "center" },
              text: {
                color: textColor,
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              },
            },
          };
        });

        

        console.log("📌 ข้อมูล markedDates ที่อัปเดตแล้ว:", newMarkedDates);
        setMarkedDates(newMarkedDates);
        setError(null);
      } catch (err) {
        console.error("❌ มีข้อผิดพลาดในการดึงข้อมูลปฏิทิน:", err.response || err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [authState]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ปฏิทินการทำกายภาพ</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2B7AAC" />
      ) : (
        <Calendar
          markedDates={markedDates}
          markingType="custom"
          hideExtraDays={true}
          style={styles.calendar} // 🔹 กำหนดพื้นหลังของปฏิทิน
          renderHeader={(date) => {
            // เปลี่ยนปี ค.ศ. เป็น พ.ศ. (บวก 543)
            const year = date.getFullYear() + 543;
            const month = LocaleConfig.locales["th"].monthNames[date.getMonth()];
            return (
              <Text style={styles.headerText}>
                {month} {year}
              </Text>
            );
          }}
          theme={{
            todayBackgroundColor: "#B9E4FF",
            arrowColor: "#2B7AAC",
            textMonthFontSize: 20,
            textDayFontSize: 18,
            textDayHeaderFontSize: 16,
            textMonthFontFamily: "Kanit",
            textDayFontFamily: "Kanit",
            textDayHeaderFontFamily: "Kanit",
            calendarBackground: "#F5FBFF", // 🔹 เปลี่ยนสีพื้นหลังของปฏิทิน

          }}
          dayComponent={({ date }) => {
            const marking = markedDates[date.dateString];
            const today = new Date().setHours(0, 0, 0, 0);
            const dayDate = new Date(date.dateString).setHours(0, 0, 0, 0);
          
            let textColor = "#000"; // สีเริ่มต้นเป็นสีดำ
          
            if (marking) {
              textColor = marking.customStyles?.text?.color || "#000";
            } else if (dayDate < today) {
              textColor = "red"; // วันที่ผ่านมาเป็นสีแดง
            } else if (dayDate > today) {
              textColor = "lightgray"; // วันที่ในอนาคตเป็นสีเทาอ่อน
            }

            return (
              <View style={styles.dayContainer}>
                {marking && marking.showStar && (
                  <Text style={styles.star}>⭐</Text>
                )}
                <Text style={[styles.dayText, { color: textColor }]}>
                  {date.day}
                </Text>
              </View>
            );
          }}
        />
      )}

      {/* ส่วน Legend เพื่ออธิบายสถานะต่างๆ */}
      <View style={styles.legendContainer}>
        <LegendItem color="#1DD345" label="ทำได้ดี" />
        <LegendItem color="orange" label="ควรปรับปรุง" />
        <LegendItem color="#93C5FD" label="แพทย์ยังไม่ประเมิน" />
        <LegendItem color="red" label="คุณไม่ได้กายภาพบำบัด" />
        <Text style={styles.getstar}>⭐ วันที่ทำกายภาพครบทั้ง 4 ด่าน </Text>
      </View>
    </View>
  );
};

// คอมโพเนนต์ LegendItem สำหรับแสดงคำอธิบายแต่ละสถานะ
const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendCircle, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  heading: {
    fontSize: 24,
    fontFamily: "Kanit",
    borderLeftWidth: 3,
    paddingLeft: 10,
    borderColor: "#87CEFA",
    color: "#333",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  star: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    fontSize: 14,
    color: "#FFD700",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  legendContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendCircle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    fontFamily: "Kanit",
  },
  getstar: {
    fontSize: 16,
    marginTop: 5,
    fontFamily: "Kanit",
  },
  headerText:{
    fontSize: 20,
    fontFamily: "Kanit",
    color:"#2B7AAC"
  },
  calendar:{
    borderRadius:15,
    marginTop:15
  }
});

export default History;
