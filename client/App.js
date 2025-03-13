import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigation";
import { useFonts } from "expo-font";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

export default function App() {
  let [fontsLoaded] = useFonts({
    // นำเข้าฟอนต์และระบุชื่อฟอนต์ที่ใช้งาน
    Kanit: require("./assets/fonts/Kanit-Regular.ttf"),
    // สามารถเพิ่มฟอนต์อื่น ๆ ตามต้องการได้ที่นี่
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

  return (
    <NavigationContainer>
      <RootNavigation />
      <Toast />
    </NavigationContainer>
  );
}
