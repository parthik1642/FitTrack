import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Reanimated, {
  FadeInDown,
  FadeInUp,
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

const { width } = Dimensions.get("window");

function AmbientOrb({ size, color, top, left, delay }: any) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.2, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.85, { duration: 3600, easing: Easing.inOut(Easing.sin) })
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

// Rotating ring around avatar
function AvatarRing() {
  const rotate = useSharedValue(0);
  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));
  return (
    <Reanimated.View style={[styles.avatarRing, style]} pointerEvents="none">
      <View style={styles.avatarRingDot} />
    </Reanimated.View>
  );
}

function FeatureRow({ icon, label, desc, delay }: { icon: keyof typeof Ionicons.glyphMap; label: string; desc: string; delay: number }) {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Reanimated.View entering={FadeInDown.delay(delay).duration(400).springify().damping(16)} style={scaleStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { scale.value = withSpring(0.975, { damping: 20 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
        style={styles.featureRow}
      >
        <View style={styles.featureIconWrap}>
          <Ionicons name={icon} size={18} color="#A78BFA" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.featureLabel}>{label}</Text>
          <Text style={styles.featureDesc}>{desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#3F3F46" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export default function ProfileScreen() {
  const [workoutCount, setWorkoutCount] = useState(0);

  useFocusEffect(useCallback(() => {
    const data = getAllWorkouts();
    setWorkoutCount(data.length);
  }, []));

  const level = Math.max(1, Math.floor(workoutCount / 5) + 1);

  // Avatar pulse
  const avatarScale = useSharedValue(1);
  useEffect(() => {
    avatarScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.97, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, []);
  const avatarStyle = useAnimatedStyle(() => ({ transform: [{ scale: avatarScale.value }] }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AmbientOrb size={260} color="#7C3AED" top={-70} left={-60} delay={0} />
        <AmbientOrb size={200} color="#0EA5E9" top={350} left={width - 80} delay={700} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <Reanimated.View entering={FadeInDown.duration(500).springify().damping(18)}>
            <View style={styles.heroBadge}>
              <View style={styles.heroDot} />
              <Text style={styles.heroMini}>YOUR ACCOUNT</Text>
            </View>
            <Text style={styles.heading}>Profile</Text>
          </Reanimated.View>

          {/* Avatar Card */}
          <Reanimated.View entering={FadeInDown.delay(120).duration(500).springify().damping(16)} style={styles.avatarCardOuter}>
            <BlurView intensity={36} tint="dark" style={styles.avatarCard}>
              {/* Shimmer */}
              <LinearGradient
                colors={["transparent", "rgba(124,58,237,0.08)", "transparent"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              <View style={styles.avatarSection}>
                <View style={styles.avatarWrap}>
                  <AvatarRing />
                  <Reanimated.View style={[styles.avatarCircle, avatarStyle]}>
                    <LinearGradient colors={["#7C3AED", "#4F1DBF"]} style={styles.avatarGrad}>
                      <Text style={styles.avatarEmoji}>💪</Text>
                    </LinearGradient>
                  </Reanimated.View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>FitTrack Athlete</Text>
                  <Text style={styles.userTagline}>Stay consistent. Stay strong.</Text>
                  <View style={styles.levelBadge}>
                    <Ionicons name="flash" size={13} color="#FBBF24" />
                    <Text style={styles.levelBadgeText}>Level {level} Athlete</Text>
                  </View>
                </View>
              </View>

              {/* Mini stats */}
              <View style={styles.miniStatsRow}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatVal}>{workoutCount}</Text>
                  <Text style={styles.miniStatLabel}>Workouts</Text>
                </View>
                <View style={styles.miniStatDivider} />
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatVal}>{level}</Text>
                  <Text style={styles.miniStatLabel}>Level</Text>
                </View>
                <View style={styles.miniStatDivider} />
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatVal}>{workoutCount * 5}</Text>
                  <Text style={styles.miniStatLabel}>XP</Text>
                </View>
              </View>
            </BlurView>
          </Reanimated.View>

          {/* Features */}
          <Reanimated.View entering={FadeInDown.delay(260).duration(400)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Features</Text>
          </Reanimated.View>

          <Reanimated.View entering={FadeInDown.delay(300).duration(450).springify()} style={styles.featuresCardOuter}>
            <BlurView intensity={30} tint="dark" style={styles.featuresCard}>
              <FeatureRow icon="barbell-outline" label="Workout Logging" desc="Track every session, every rep" delay={320} />
              <View style={styles.featureDivider} />
              <FeatureRow icon="stats-chart-outline" label="Progress Tracking" desc="Visualize your improvements over time" delay={370} />
              <View style={styles.featureDivider} />
              <FeatureRow icon="flame-outline" label="Daily Streaks" desc="Build consistency with streak tracking" delay={420} />
              <View style={styles.featureDivider} />
              <FeatureRow icon="book-outline" label="Exercise Library" desc="12+ exercises with muscle targeting" delay={470} />
            </BlurView>
          </Reanimated.View>

          {/* App info */}
          <Reanimated.View entering={FadeInDown.delay(520).duration(400)} style={styles.infoCardOuter}>
            <BlurView intensity={24} tint="dark" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Built with</Text>
                <Text style={styles.infoValue}>Expo + Reanimated</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Storage</Text>
                <Text style={styles.infoValue}>SQLite (local)</Text>
              </View>
            </BlurView>
          </Reanimated.View>

          {/* Footer */}
          <Reanimated.View entering={FadeInUp.delay(600).duration(400)} style={styles.footer}>
            <Text style={styles.footerText}>FitTrack · Made to push you further 🚀</Text>
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
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#A78BFA" },
  heroMini: { color: "#C4B5FD", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heading: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", letterSpacing: -0.5, marginTop: 4, marginBottom: 20 },

  // Avatar card
  avatarCardOuter: { borderRadius: 28, overflow: "hidden", marginBottom: 18 },
  avatarCard: {
    borderRadius: 28, padding: 20, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  avatarSection: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  avatarWrap: { position: "relative", width: 72, height: 72 },
  avatarRing: {
    position: "absolute", width: 72, height: 72, borderRadius: 36,
    borderWidth: 2, borderColor: "rgba(167,139,250,0.4)", borderStyle: "dashed",
    alignItems: "flex-start", justifyContent: "center",
  },
  avatarRingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#A78BFA", marginLeft: -4 },
  avatarCircle: { width: 68, height: 68, borderRadius: 34, overflow: "hidden", margin: 2 },
  avatarGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 30 },
  userName: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginBottom: 4 },
  userTagline: { color: "#71717A", fontSize: 13, fontWeight: "500", marginBottom: 8 },
  levelBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(251,191,36,0.15)", borderWidth: 1, borderColor: "rgba(251,191,36,0.3)",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start",
  },
  levelBadgeText: { color: "#FBBF24", fontSize: 11, fontWeight: "800" },

  miniStatsRow: { flexDirection: "row", alignItems: "center" },
  miniStat: { flex: 1, alignItems: "center" },
  miniStatVal: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  miniStatLabel: { color: "#52525B", fontSize: 11, fontWeight: "700", marginTop: 2 },
  miniStatDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.07)" },

  // Section header
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },

  // Features
  featuresCardOuter: { borderRadius: 24, overflow: "hidden", marginBottom: 14 },
  featuresCard: {
    borderRadius: 24, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  featureIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(124,58,237,0.18)", alignItems: "center", justifyContent: "center" },
  featureLabel: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  featureDesc: { color: "#71717A", fontSize: 12, marginTop: 2, fontWeight: "500" },
  featureDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginLeft: 66 },

  // Info
  infoCardOuter: { borderRadius: 22, overflow: "hidden", marginBottom: 20 },
  infoCard: {
    borderRadius: 22, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, paddingHorizontal: 16 },
  infoLabel: { color: "#52525B", fontSize: 13, fontWeight: "600" },
  infoValue: { color: "#A1A1AA", fontSize: 13, fontWeight: "700" },
  infoDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)" },

  // Footer
  footer: { alignItems: "center", paddingTop: 4 },
  footerText: { color: "#3F3F46", fontSize: 12, fontWeight: "600" },
});