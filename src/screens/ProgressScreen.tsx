import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { Colors } from "../constants/colors";
import { getAllWorkouts } from "../database/workoutService";
import { calculateStreak } from "../utils/streak";
import { Workout } from "../types/workout";

export default function ProgressScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [streak, setStreak] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const data = getAllWorkouts();
    setWorkouts(data);

    const dates = data.map((w) => w.date);
    setStreak(calculateStreak(dates));

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

  const totalCalories = workouts.reduce((sum, item) => sum + item.calories, 0);
  const totalMinutes = workouts.reduce((sum, item) => sum + item.duration, 0);
  const totalWorkouts = workouts.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.subheading}>Your performance</Text>
        <Text style={styles.title}>Progress</Text>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>🔥 Current Streak</Text>
          <Text style={styles.bigNumber}>{streak} days</Text>
          <Text style={styles.helperText}>
            Keep logging workouts daily to grow your streak.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Calories Burned</Text>
          <Text style={styles.largeValue}>{totalCalories}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress Note</Text>
          <Text style={styles.noteText}>
            You are building consistency. Keep tracking workouts and your progress
            will become easier to measure.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  subheading: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  highlightCard: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },
  helperText: {
    fontSize: 14,
    color: "#EDE9FE",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  largeValue: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
  },
  noteText: {
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
  },
});