import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const SuccessCardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerCard}>
          <View />
          
        </View>
        <Image
          source={require("../../img/question/popup.png")} // Replace with your image URL or local asset
          style={styles.image}
        />
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{"มากายภาพบำบัดกันเถอะ!"}</Text>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("Step")}
        >
          <Text style={styles.nextButtonText}>เริ่ม</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerCard: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: width * 0.9,
    height: height * 0.2,
  },
  questionContainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 25,
    color: "#333",
    textAlign: "center",
    fontFamily:"Kanit",
  },
  nextButton: {
    padding: 10,
    borderRadius: 25,
    width: 150,
    backgroundColor: "#66C4FF",

    alignSelf: "center",
    marginBottom: 20,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily:"Kanit",
  },
});

export default SuccessCardScreen;
