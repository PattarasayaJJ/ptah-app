import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";
import Toast from "react-native-toast-message";

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

  const handleDeleteNotification = async (id) => {
    try {
      const response = await axios.post(`notification/${id}/dismiss`);
      if (response.status === 200) {
        handleGetNotifications();
        Toast.show({
          type: "success",
          text1: "ลบการแจ้งเตือน สำเร็จ!",
          text2: "",
        });
      }
    } catch (err) {
      console.log("err get notifications", err);
    }
  };

  const handleDeleteNotificationAll = async () => {
    try {
      const response = await axios.post(
        `notification/notifications/dismiss-all`
      );
      if (response.status === 200) {
        handleGetNotifications();
        Toast.show({
          type: "success",
          text1: "ลบการแจ้งเตือน สำเร็จ!",
          text2: "",
        });
      }
    } catch (err) {
      console.log("err get notifications", err);
    }
  };

  const NotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        delayLongPress={1500}
        onLongPress={() =>
          Alert.alert(
            "ยืนยันการลบ!",
            `คุณต้องการลบ การแจ้งเตือน ${item.title} นี้ใช่หรือไม่`,
            [
              {
                text: "ยกเลิก",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "ยืนยัน",
                onPress: () => handleDeleteNotification(item._id),
              },
            ]
          )
        }
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewFlatlist}>
        <View style={styles.viewBtn}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "ยืนยันการลบ!",
                `คุณต้องการลบ การแจ้งเตือน ทั้งหมดใช่หรือไม่ ?`,
                [
                  {
                    text: "ยกเลิก",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "ยืนยัน",
                    onPress: () => handleDeleteNotificationAll(),
                  },
                ]
              )
            }
            disabled={notificationDatas.length === 0}

          >
            <Text
              style={styles.titleDelete(
                notificationDatas.length > 0 ? "have" : "no"
              )}
            >
              ลบทั้งหมด
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
    backgroundColor: "white",
  },
  viewBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  titleDelete: (type) => ({
    fontSize: 16,
    color: type === "have" ? "#0188dc" : "#BEBEBE",
    paddingBottom: 10,
    fontFamily: "Kanit",

  }),
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
