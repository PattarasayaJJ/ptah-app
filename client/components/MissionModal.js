import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const MissionModal = ({ visible, mission = {}, onClose, onStart }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* ปุ่มปิด */}
          {mission.no !== 1 && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome5 name="times" size={20} color="#999" />
            </TouchableOpacity>
          )}

          {/* หัวข้อ */}
          <Text style={styles.title}>ด่านที่ {mission.no}</Text>
          <Text style={styles.subtitle}>
            {Object.keys(mission).length === 0
              ? ""
              : mission?.name.replace("\n", "")}
          </Text>

          {/* รูปภาพ */}
          <Image
            source={require("../img/mission_1.png")} // เปลี่ยนเป็นรูปของคุณ
            style={styles.image}
          />

          {/* คำอธิบาย */}
          {mission.no === 1 ? (
            <>
              <Text style={[styles.description, { color: "red" }]}>
                สื่อการเรียนรู้ในการจัดท่าทางไม่นำไประเมิน
              </Text>
              <Text style={[styles.note, { color: "#008cb7" }]}>
                ท่านสามารถข้ามไปในด่านถัดไปเพื่อเริ่มทำกายภาพได้
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                ประกอบด้วยท่ากายภาพ{" "}
                {Object.keys(mission).length === 0
                  ? ""
                  : mission.submission.length}{" "}
                ท่า
              </Text>
              <Text style={styles.note}>
                หมายเหตุ : มีการนับเวลาในการทำกายภาพ
              </Text>
            </>
          )}

          {/* ปุ่มเริ่ม */}
          <View style={styles.viewButton}>
            {mission.no === 1 && (
              <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                <Text style={styles.skipButtonText}>ข้าม</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.startButton,
                { marginLeft: mission.no !== 1 ? 0 : 15 },
              ]}
              onPress={onStart}
            >
              <Text style={styles.startButtonText}>เริ่ม</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 22,
    color: "#333",
    marginTop: 10,
    marginBottom: 10,
    fontFamily:"Kanit"

  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontFamily:"Kanit"

  },
  image: {
    width: 160,
    height: 120,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontFamily:"Kanit"

  },
  note: {
    fontSize: 14,
    color: "#FF5733",
    marginBottom: 15,
    fontFamily:"Kanit"

  },
  viewButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  skipButton: {
    borderColor: "#66C4FF",
    borderWidth: 1,
    width: width * 0.36,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 10,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#66C4FF",
    width: width * 0.36,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#66C4FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MissionModal;
