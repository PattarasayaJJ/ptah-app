import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigation";
import { useFonts } from "expo-font";
// import * as Notifications from "expo-notifications";
// import messaging from "@react-native-firebase/messaging";

export default function App() {
  let [fontsLoaded] = useFonts({
    // นำเข้าฟอนต์และระบุชื่อฟอนต์ที่ใช้งาน
    Kanit: require("./assets/fonts/Kanit-Regular.ttf"),
    // สามารถเพิ่มฟอนต์อื่น ๆ ตามต้องการได้ที่นี่
  });

  // useEffect(() => {
  //   registerForPushNotifications();

  //   // Handle foreground notifications
  //   const unsubscribe = messaging().onMessage(messaging, (payload) => {
  //     console.log("Message received: ", payload);
  //     Alert.alert("New Notification", payload.notification.body);
  //   });

  //   return unsubscribe;
  // }, []);

  // const registerForPushNotifications = async () => {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert("Permission Denied", "You need to enable notifications.");
  //     return;
  //   }

  //   // รับ Expo Push Token
  //   const token = await messaging().getToken();

  //   // const token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log("Push Token:", token);
  //   // setExpoPushToken(token);
  // };

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
