import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/authContext";

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8080/api/v1/auth/leaderboard");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const sorted = data.leaderboard.sort((a, b) => b.stars - a.stars);
        setLeaderboard(sorted);
        setLastUpdated(new Date());
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const thaiYear = date.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.

    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\d{4}/, thaiYear)// แทนที่ปี ค.ศ. ด้วย พ.ศ.
    .replace("ค.ศ.", "พ.ศ."); // แทนที่ "ค.ศ." ด้วย "พ.ศ."
  };

  const renderPodium = () => {
    if (leaderboard.length < 3) return null;

    const [first, second, third] = leaderboard.slice(0, 3);

    return (
      <View style={styles.podiumContainer}>
        <Text style={[styles.rankName, styles.rank1]}>
          {first.name.slice(0, 3)}***  {first.surname.slice(0, 3)}**
        </Text>
        <Text style={[styles.rankStars, styles.star1]}>{first.stars} ⭐</Text>
        <Text style={[styles.rankName, styles.rank2]}>
          {second.name.slice(0, 3)}***  {second.surname.slice(0, 3)}**
        </Text>
        <Text style={[styles.rankStars, styles.star2]}>{second.stars} ⭐</Text>
        <Text style={[styles.rankName, styles.rank3]}>
          {third.name.slice(0, 3)}***  {third.surname.slice(0, 3)}**
        </Text>
        <Text style={[styles.rankStars, styles.star3]}>{third.stars} ⭐</Text>
        <Image source={require("../img/podium.png")} style={styles.podiumImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>อันดับดาวประจำวัน</Text>
      {lastUpdated && (
        <Text style={styles.lastUpdated}>ข้อมูลล่าสุด: {formatDate(lastUpdated)}</Text>
      )}

      {renderPodium()}

      <FlatList
        data={leaderboard.slice(3)}
        keyExtractor={(item) => item.id} // ใช้ id เป็น key
        renderItem={({ item, index }) => {
          const isCurrentUser = item.id === authState.user?.id; // เปรียบเทียบด้วย id

          return (
            <View style={styles.row}>
              <Text style={styles.rank}>{index + 4}</Text>
              <Text
                style={[
                  styles.name,
                  isCurrentUser && styles.currentUserName,
                ]}
              >
                {item.name.slice(0, 3)}***  {item.surname.slice(0, 3)}**
              </Text>
              <Text style={styles.stars}>{item.stars} ⭐</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Kanit",
  },
  lastUpdated: {
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
    fontFamily: "Kanit",
  },
  podiumContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    marginTop: 90,
    marginBottom: 70,
  },
  podiumImage: {
    width: 220,
    height: 220,
  },
  rankName: {
    position: "absolute",
    fontSize: 16,
    color: "#333",
    fontFamily: "Kanit",
  },
  rankStars: {
    position: "absolute",
    fontSize: 20,
    color: "#333",
    fontFamily: "Kanit",
  },
  rank1: {
    top: -45,
    left: "44%",
    transform: [{ translateX: -20 }],
  },
  rank2: {
    top: 85,
    left: "12%",
  },
  rank3: {
    top: 100,
    right: "12%",
  },
  star1: {
    top: -75, // เลื่อนขึ้นไปอยู่บนชื่อ
    left: "50%",
    transform: [{ translateX: -20 }],
  },
  star2: {
    top: 50, // เลื่อนขึ้นไปอยู่บนชื่อ
    left: "18%",
  },
  star3: {
    top: 70, // เลื่อนขึ้นไปอยู่บนชื่อ
    right: "20%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    margin: 5,
  },
  rank: {
    fontSize: 16,
    width: 30,
    fontWeight: "bold",
    color: "#555",
  },
  name: {
    fontSize: 16,
    flex: 1,
    color: "#444",
    fontFamily: "Kanit",
  },
  stars: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Kanit",
  },
  currentUserName: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});

export default LeaderboardScreen;
