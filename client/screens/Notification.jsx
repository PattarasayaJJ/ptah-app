import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";

const notifications = [
  {
    id: "1",
    type: "camera",
    title: "แจ้งเตือนถ่ายทำกายภาพ",
    message: "ถึงเวลาทำกายภาพบำบัดแล้ว ครั้งที่ 1 เวลา 08:00 น.",
    date: "8 มีนาคม 2568 เวลา 08:00 น.",
  },
  {
    id: "2",
    type: "camera",
    title: "แจ้งเตือนถ่ายทำกายภาพ",
    message: "ถึงเวลาทำกายภาพบำบัดแล้ว ครั้งที่ 2 เวลา 16:00 น.",
    date: "7 มีนาคม 2568 เวลา 16:00 น.",
  },
  {
    id: "3",
    type: "general",
    title: "แจ้งเตือนทั่วไป",
    message: "ประกาศผู้ใช้งาน....",
    date: "7 มีนาคม 2568 เวลา 10:00 น.",
  },
];

const Notification = () => {
  const [state] = useContext(AuthContext);

  const [notificationDatas, setNotificationDatas] = useState([]);

  useEffect(() => {
    handleGetNotifications();
  }, []);

  const handleGetNotifications = async () => {
    try {
      const response = await axios.get("/notification/get-all-notification");
      if (response.status === 200) {
        setNotificationDatas(response.data.notifications);
      }
    } catch (err) {
      console.log("err get notifications", err);
    }
  };

  const NotificationItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerCard}>
          <Text style={styles.title(item.notifyType)}>{item.title}</Text>
          {item.notifyType === "การแจ้งเตือนสำคัญ" && (
            <Text style={styles.badge}>{"•"}</Text>
          )}
        </View>
        <Text style={styles.message}>{item.description}</Text>
        <Text style={styles.date}>
          {moment(item.notifyDate).format("DD MMMM YYYY เวลา HH.mm น.")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewFlatlist}>
        <FlatList
          data={notificationDatas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationItem item={item} />}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <FooterMenu />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
    backgroundColor: "white",
  },
  viewFlatlist: {
    paddingHorizontal: 14,
    paddingBottom: 70,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b0daf6",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#b0daf6",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: (type) => ({
    fontSize: 16,
    fontWeight: "bold",
    color: type === "การแจ้งเตือนสำคัญ" ? "#0188dc" : "#8acefa",
    paddingBottom: 10,
  }),
  badge: {
    fontWeight: "900",
    color: "red",
  },
  message: {
    paddingTop: 8,
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 5,
    color: "gray",
  },
});

export default Notification;
