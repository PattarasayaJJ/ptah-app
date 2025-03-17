import React, { useEffect } from "react";
import { AuthProvider } from "./context/authContext";
import ScreenMenu from "./components/Menus/ScreenMenu";
import { PostProvider } from "./context/postContext";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";

const RootNavigation = () => {
  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
      // Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: "message.notification.title",
      //     body: "message.notification.body",
      //   },
      //   trigger: null, // แสดงทันที
      // });
      Toast.show({
        type: "info",
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      await messaging()
        .subscribeToTopic("news")
        .then(() => console.log("Subscribed to topic!"));
      const token = await messaging().getToken();
      console.log("token", token);
    }
  };

  return (
    <AuthProvider>
      <PostProvider>
        <ScreenMenu />
      </PostProvider>
    </AuthProvider>
  );
};

export default RootNavigation;
