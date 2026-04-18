import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Colors } from "../constants/colors";

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
        }}
      >
        <Text style={styles.subheading}>Your account</Text>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.name}>FitTrack User</Text>
          <Text style={styles.info}>Stay consistent. Stay strong.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>App Features</Text>
          <Text style={styles.info}>• Workout logging</Text>
          <Text style={styles.info}>• Progress tracking</Text>
          <Text style={styles.info}>• Daily streaks</Text>
          <Text style={styles.info}>• Exercise library</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  subheading: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  info: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 6,
  },
});