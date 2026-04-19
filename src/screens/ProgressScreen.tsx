import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Reanimated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getAllWorkouts } from "../database/workoutService";
import { calculateStreak } from "../utils/streak";
import { Workout } from "../types/workout";

const { width } = Dimensions.get("window");

function AmbientOrb({ size, color, top, left, delay }: any) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.2, { duration: 3600, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.85, { duration: 3200, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Reanimated.View
      style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.14 }, style]}
      pointerEvents="none"
    />
  );
}

// Count-up number display
function CountUp({ value, style }: { value: number; style: any }) {
  const [display, setDisplay] = useState(0);
  const animVal = useSharedValue(0);

  useEffect(() => {
    animVal.value = 0;
    animVal.value = withTiming(value, { duration: 1500, easing: Easing.out(Easing.cubic) });
  }, [value]);

  useEffect(() => {
    let raf: ReturnType<typeof requestAnimationFrame>;
    const tick = () => { setDisplay(Math.round(animVal.value)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <Text style={style}>{display}</Text>;
}

function StatCard({ label, value, icon, accent, delay }: { label: string; value: number; icon: keyof typeof Ionicons.glyphMap; accent: string; delay: number }) {
  return (
    <Reanimated.View entering={FadeInDown.delay(delay).duration(450).springify().damping(16)} style={[styles.statCardOuter, { flex: 1 }]}>
      <BlurView intensity={32} tint="dark" style={styles.statCard}>
        <View style={[styles.statIconCircle, { backgroundColor: accent + "22" }]}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
        <CountUp value={value} style={[styles.statNumber, { color: accent }]} />
        <Text style={styles.statLabel}>{label}</Text>
      </BlurView>
    </Reanimated.View>
  );
}

export default function ProgressScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [streak, setStreak] = useState(0);

  useFocusEffect(useCallback(() => {
    const data = getAllWorkouts();
    setWorkouts(data);
    setStreak(calculateStreak(data.map((w) => w.date)));
  }, []));

  const totalCalories = workouts.reduce((s, w) => s + w.calories, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
  const totalWorkouts = workouts.length;
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
  const level = Math.max(1, Math.floor(totalWorkouts / 5) + 1);

  // Streak flame pulse
  const flamePulse = useSharedValue(1);
  useEffect(() => {
    flamePulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.9, { duration: 700, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, []);
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flamePulse.value }] }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AmbientOrb size={280} color="#F59E0B" top={-80} left={-60} delay={0} />
        <AmbientOrb size={200} color="#7C3AED" top={300} left={width - 90} delay={600} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <Reanimated.View entering={FadeInDown.duration(500).springify().damping(18)}>
            <View style={styles.heroBadge}>
              <View style={[styles.heroDot, { backgroundColor: "#FBBF24" }]} />
              <Text style={[styles.heroMini, { color: "#FDE68A" }]}>YOUR PERFORMANCE</Text>
            </View>
            <Text style={styles.heading}>Progress</Text>
            <Text style={styles.subheading}>Track your consistency and improvements.</Text>
          </Reanimated.View>

          {/* Streak card */}
          <Reanimated.View entering={FadeInDown.delay(120).duration(500).springify().damping(16)} style={styles.streakOuter}>
            <LinearGradient colors={["#92400E", "#78350F", "#451A03"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streakCard}>
              {/* Glow */}
              <View style={styles.streakGlow} />
              <View style={styles.streakLeft}>
                <Text style={styles.streakLabel}>🔥 Current Streak</Text>
                <View style={styles.streakNumRow}>
                  <CountUp value={streak} style={styles.streakNumber} />
                  <Text style={styles.streakUnit}> days</Text>
                </View>
                <Text style={styles.streakHint}>Log workouts daily to grow your streak.</Text>
              </View>
              <Reanimated.View style={[styles.streakIconWrap, flameStyle]}>
                <Text style={{ fontSize: 46 }}>🔥</Text>
              </Reanimated.View>
            </LinearGradient>
          </Reanimated.View>

          {/* 4 stat cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard label="Workouts" value={totalWorkouts} icon="barbell-outline" accent="#A78BFA" delay={200} />
              <StatCard label="Minutes" value={totalMinutes} icon="time-outline" accent="#34D399" delay={260} />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Calories" value={totalCalories} icon="flame-outline" accent="#F87171" delay={320} />
              <StatCard label="Avg Duration" value={avgDuration} icon="trending-up-outline" accent="#60A5FA" delay={380} />
            </View>
          </View>

          {/* Level card */}
          <Reanimated.View entering={FadeInDown.delay(440).duration(450).springify().damping(16)} style={styles.levelOuter}>
            <BlurView intensity={32} tint="dark" style={styles.levelCard}>
              <View style={styles.levelTop}>
                <View style={styles.levelLeft}>
                  <Text style={styles.levelLabel}>Athlete Level</Text>
                  <CountUp value={level} style={styles.levelNumber} />
                </View>
                <View style={styles.levelIconCircle}>
                  <Ionicons name="flash" size={26} color="#FBBF24" />
                </View>
              </View>
              {/* Progress to next level */}
              <View style={styles.progressBg}>
                <Reanimated.View
                  entering={FadeInDown.delay(700).duration(900)}
                  style={[styles.progressFill, { width: `${Math.min((totalWorkouts % 5) * 20, 100)}%` }]}
                />
              </View>
              <View style={styles.levelFooter}>
                <Text style={styles.levelHint}>Level {level} · {totalWorkouts % 5}/5 workouts to Level {level + 1}</Text>
              </View>
            </BlurView>
          </Reanimated.View>

          {/* Milestone card */}
          <Reanimated.View entering={FadeInDown.delay(500).duration(450).springify().damping(16)} style={styles.milestoneOuter}>
            <BlurView intensity={28} tint="dark" style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>Milestones</Text>
              {[
                { label: "First Workout", done: totalWorkouts >= 1, icon: "checkmark-circle" as const },
                { label: "5 Workouts", done: totalWorkouts >= 5, icon: "checkmark-circle" as const },
                { label: "10 Workouts", done: totalWorkouts >= 10, icon: "checkmark-circle" as const },
                { label: "1000 Calories", done: totalCalories >= 1000, icon: "checkmark-circle" as const },
                { label: "3-Day Streak", done: streak >= 3, icon: "checkmark-circle" as const },
              ].map((m) => (
                <View key={m.label} style={styles.milestoneRow}>
                  <Ionicons
                    name={m.done ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={m.done ? "#34D399" : "#3F3F46"}
                  />
                  <Text style={[styles.milestoneText, m.done && styles.milestoneDone]}>{m.label}</Text>
                  {m.done && <View style={styles.milestoneBadge}><Text style={styles.milestoneBadgeText}>Done</Text></View>}
                </View>
              ))}
            </BlurView>
          </Reanimated.View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070D" },
  container: { flex: 1, backgroundColor: "#05070D" },
  scroll: { paddingHorizontal: 18, paddingBottom: 40, paddingTop: 10 },

  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  heroDot: { width: 6, height: 6, borderRadius: 3 },
  heroMini: { fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heading: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", letterSpacing: -0.5, marginTop: 4 },
  subheading: { color: "#71717A", fontSize: 14, marginTop: 6, marginBottom: 22, fontWeight: "500" },

  // Streak
  streakOuter: { borderRadius: 28, overflow: "hidden", marginBottom: 18 },
  streakCard: { borderRadius: 28, padding: 22, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  streakGlow: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(251,191,36,0.15)", top: -60, right: -40 },
  streakLeft: { flex: 1 },
  streakLabel: { color: "#FDE68A", fontSize: 13, fontWeight: "800", marginBottom: 6 },
  streakNumRow: { flexDirection: "row", alignItems: "baseline" },
  streakNumber: { color: "#FFFFFF", fontSize: 44, fontWeight: "900", letterSpacing: -1 },
  streakUnit: { color: "#FDE68A", fontSize: 18, fontWeight: "700" },
  streakHint: { color: "#D97706", fontSize: 13, marginTop: 8, fontWeight: "500" },
  streakIconWrap: { marginLeft: 12 },

  // Stats grid
  statsGrid: { gap: 12, marginBottom: 14 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCardOuter: { borderRadius: 22, overflow: "hidden" },
  statCard: {
    borderRadius: 22, padding: 16, alignItems: "center", overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  statIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statNumber: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  statLabel: { color: "#71717A", fontSize: 11, fontWeight: "700", marginTop: 4 },

  // Level
  levelOuter: { borderRadius: 24, overflow: "hidden", marginBottom: 14 },
  levelCard: {
    borderRadius: 24, padding: 18, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  levelTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  levelLeft: {},
  levelLabel: { color: "#A1A1AA", fontSize: 12, fontWeight: "700", letterSpacing: 0.4, marginBottom: 4 },
  levelNumber: { color: "#FBBF24", fontSize: 36, fontWeight: "900", letterSpacing: -1 },
  levelIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(251,191,36,0.15)", alignItems: "center", justifyContent: "center" },
  progressBg: { height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99, backgroundColor: "#FBBF24" },
  levelFooter: { marginTop: 8 },
  levelHint: { color: "#52525B", fontSize: 11, fontWeight: "700" },

  // Milestones
  milestoneOuter: { borderRadius: 24, overflow: "hidden", marginBottom: 14 },
  milestoneCard: {
    borderRadius: 24, padding: 18, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  milestoneTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginBottom: 14 },
  milestoneRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  milestoneText: { flex: 1, color: "#71717A", fontSize: 14, fontWeight: "600" },
  milestoneDone: { color: "#FFFFFF" },
  milestoneBadge: { backgroundColor: "rgba(52,211,153,0.15)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: "rgba(52,211,153,0.3)" },
  milestoneBadgeText: { color: "#34D399", fontSize: 11, fontWeight: "800" },
});