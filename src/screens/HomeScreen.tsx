import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Reanimated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  SharedValue,
  Easing,
} from "react-native-reanimated";

import { getAllWorkouts, deleteWorkout } from "../database/workoutService";
import { Workout } from "../types/workout";
import { HomeStackParamList } from "../navigation/HomeStack";

const { width, height } = Dimensions.get("window");

// ─── Ambient orb ───────────────────────────────────────────────
function FloatingOrb({ size, color, top, left, delay, duration }: any) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(withSequence(
      withTiming(-18, { duration, easing: Easing.inOut(Easing.sin) }),
      withTiming(8,  { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
    translateX.value = withDelay(delay + 300, withRepeat(withSequence(
      withTiming(10, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
      withTiming(-8, { duration: duration * 0.9, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
    scale.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.15, { duration: duration * 0.9 }),
      withTiming(0.9,  { duration: duration * 0.8 })
    ), -1, true));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Reanimated.View
      style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.18 }, style]}
      pointerEvents="none"
    />
  );
}

// ─── Floating fitness icons ────────────────────────────────────
function FloatingBackground({ scrollY }: { scrollY: SharedValue<number> }) {
  const y1 = useSharedValue(0); const rot1 = useSharedValue(0);
  const y2 = useSharedValue(0); const rot2 = useSharedValue(0);
  const y3 = useSharedValue(0);

  useEffect(() => {
    y1.value = withRepeat(withSequence(withTiming(-14, { duration: 3200, easing: Easing.inOut(Easing.quad) }), withTiming(6, { duration: 2800, easing: Easing.inOut(Easing.quad) })), -1, true);
    rot1.value = withRepeat(withSequence(withTiming(8, { duration: 4000 }), withTiming(-6, { duration: 3500 })), -1, true);
    y2.value = withDelay(600, withRepeat(withSequence(withTiming(-22, { duration: 2500, easing: Easing.inOut(Easing.sin) }), withTiming(10, { duration: 2200, easing: Easing.inOut(Easing.sin) })), -1, true));
    rot2.value = withDelay(400, withRepeat(withSequence(withTiming(-12, { duration: 3800 }), withTiming(8, { duration: 3200 })), -1, true));
    y3.value = withDelay(1000, withRepeat(withSequence(withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }), withTiming(14, { duration: 1800, easing: Easing.inOut(Easing.sin) })), -1, true));
  }, []);

  const icon1Style = useAnimatedStyle(() => ({ transform: [{ translateY: y1.value + interpolate(scrollY.value, [0, 300], [0, -30]) }, { rotate: `${rot1.value}deg` }] }));
  const icon2Style = useAnimatedStyle(() => ({ transform: [{ translateY: y2.value + interpolate(scrollY.value, [0, 300], [0, -50]) }, { rotate: `${rot2.value}deg` }] }));
  const icon3Style = useAnimatedStyle(() => ({ transform: [{ translateY: y3.value + interpolate(scrollY.value, [0, 300], [0, -20]) }] }));

  return (
    <>
      <FloatingOrb size={280} color="#7C3AED" top={-60}  left={-80}       delay={0}   duration={4000} />
      <FloatingOrb size={200} color="#2563EB" top={200}  left={width-100} delay={800} duration={3500} />
      <FloatingOrb size={160} color="#059669" top={height*0.55} left={-40} delay={400} duration={5000} />
      <Reanimated.View style={[styles.bgIconWrap, styles.bgIcon1, icon1Style]} pointerEvents="none">
        <MaterialCommunityIcons name="dumbbell" size={88} color="rgba(196,181,253,0.09)" />
      </Reanimated.View>
      <Reanimated.View style={[styles.bgIconWrap, styles.bgIcon2, icon2Style]} pointerEvents="none">
        <MaterialCommunityIcons name="run-fast" size={96} color="rgba(167,139,250,0.12)" />
      </Reanimated.View>
      <Reanimated.View style={[styles.bgIconWrap, styles.bgIcon3, icon3Style]} pointerEvents="none">
        <MaterialCommunityIcons name="lightning-bolt" size={72} color="rgba(74,222,128,0.08)" />
      </Reanimated.View>
    </>
  );
}

// ─── Hero glow ─────────────────────────────────────────────────
function HeroGlow() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.quad) }), withTiming(0.85, { duration: 1800, easing: Easing.inOut(Easing.quad) })), -1, true);
    opacity.value = withRepeat(withSequence(withTiming(0.7, { duration: 2000 }), withTiming(0.3, { duration: 1800 })), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  return (
    <Reanimated.View style={[styles.heroGlowOuter, style]} pointerEvents="none">
      <LinearGradient colors={["rgba(124,58,237,0.85)", "rgba(99,102,241,0.4)", "transparent"]} style={styles.heroGlowGradient} />
    </Reanimated.View>
  );
}

// ─── Shimmer ───────────────────────────────────────────────────
function ShimmerLine() {
  const x = useSharedValue(-width);
  useEffect(() => {
    const run = () => { x.value = -width; x.value = withTiming(width * 1.2, { duration: 1800, easing: Easing.out(Easing.quad) }); };
    run();
    const id = setInterval(run, 4500);
    return () => clearInterval(id);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Reanimated.View style={[styles.shimmerWrap, style]} pointerEvents="none">
      <LinearGradient colors={["transparent", "rgba(255,255,255,0.12)", "rgba(255,255,255,0.04)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shimmerGrad} />
    </Reanimated.View>
  );
}

// ─── Count-up text ─────────────────────────────────────────────
function CountUpText({ value, style }: { value: number; style: any }) {
  const animVal = useSharedValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    animVal.value = 0;
    animVal.value = withTiming(value, { duration: 1400, easing: Easing.out(Easing.cubic) });
  }, [value]);
  useEffect(() => {
    let frame: ReturnType<typeof requestAnimationFrame>;
    const tick = () => { setDisplay(Math.round(animVal.value)); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <Text style={style}>{display}</Text>;
}

// ─── Metric card ───────────────────────────────────────────────
function MetricCard({ icon, label, value, delay, accent }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: number; delay: number; accent: string }) {
  const glow = useSharedValue(0.4);
  useEffect(() => {
    glow.value = withDelay(delay + 400, withRepeat(withSequence(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), withTiming(0.3, { duration: 1400, easing: Easing.inOut(Easing.sin) })), -1, true));
  }, []);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <Reanimated.View entering={FadeInDown.delay(delay).duration(500).springify().damping(14)} style={styles.metricWrap}>
      <Reanimated.View style={[StyleSheet.absoluteFill, styles.metricGlowBorder, { borderColor: accent }, glowStyle]} />
      <BlurView intensity={40} tint="dark" style={styles.metricCard}>
        <View style={[styles.metricIconBox, { backgroundColor: accent + "33" }]}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
        <View>
          <CountUpText value={value} style={styles.metricValue} />
          <Text style={styles.metricLabel}>{label}</Text>
        </View>
      </BlurView>
    </Reanimated.View>
  );
}

// ─── Workout card ──────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Strength: "#A78BFA", Cardio: "#34D399", Flexibility: "#60A5FA",
  HIIT: "#F87171", Sports: "#FBBF24", default: "#C4B5FD",
};

function WorkoutCard({ item, onDelete, onPress, index }: { item: Workout; onDelete: (id: number) => void; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  const accent = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.default;

  return (
    <Reanimated.View entering={FadeInDown.delay(index * 70).duration(450).springify().damping(16)} style={cardStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.975, { damping: 20, stiffness: 400 }); opacity.value = withTiming(0.88, { duration: 80 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 300 }); opacity.value = withTiming(1, { duration: 150 }); }}
        style={styles.workoutOuter}
      >
        <BlurView intensity={30} tint="dark" style={styles.workoutCard}>
          <View style={[styles.accentBar, { backgroundColor: accent }]} />
          <View style={styles.workoutTopRow}>
            <View style={[styles.categoryBadge, { borderColor: accent + "55", backgroundColor: accent + "18" }]}>
              <Text style={[styles.categoryBadgeText, { color: accent }]}>{item.category}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
              <Ionicons name="trash-outline" size={15} color="#FB7185" />
            </TouchableOpacity>
          </View>
          <Text style={styles.workoutTitle}>{item.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={15} color="#C4B5FD" />
              <Text style={styles.metaChipText}>{item.duration} min</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialCommunityIcons name="fire" size={15} color="#FDA4AF" />
              <Text style={styles.metaChipText}>{item.calories} cal</Text>
            </View>
            {item.notes ? (
              <View style={styles.metaChip}>
                <Ionicons name="document-text-outline" size={14} color="#71717A" />
                <Text style={[styles.metaChipText, { color: "#71717A" }]}>Notes</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </BlurView>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

// ─── FAB ────────────────────────────────────────────────────────
function FABButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(0);
  useEffect(() => { scale.value = withDelay(600, withSpring(1, { damping: 12, stiffness: 200 })); }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Reanimated.View style={[styles.fab, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.92); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={1}
      >
        <LinearGradient colors={["#7C3AED", "#6D28D9", "#4F1DBF"]} style={styles.fabGrad}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

// ─── Main screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Use the stack navigator for WorkoutDetail / EditWorkout pushes
  const stackNav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  // Use the parent tab navigator to switch to the Add tab
  const tabNav = useNavigation<any>();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({ onScroll: (e) => { scrollY.value = e.contentOffset.y; } });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 180], [1, 0.94], "clamp");
    const translateY = interpolate(scrollY.value, [0, 180], [0, -28], "clamp");
    const opacity = interpolate(scrollY.value, [0, 200], [1, 0.88], "clamp");
    return { transform: [{ scale }, { translateY }], opacity };
  });

  const loadWorkouts = () => {
    try { setWorkouts(getAllWorkouts()); } catch (e) { console.log(e); }
  };
  useFocusEffect(useCallback(() => { loadWorkouts(); }, []));

  const totalWorkouts = workouts.length;
  const totalCalories = useMemo(() => workouts.reduce((s, w) => s + w.calories, 0), [workouts]);
  const totalMinutes  = useMemo(() => workouts.reduce((s, w) => s + w.duration, 0), [workouts]);
  const level = Math.max(1, Math.floor(totalWorkouts / 5) + 1);

  const handleDelete = (id: number) => {
    Alert.alert("Delete Workout", "Remove this session?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { try { deleteWorkout(id); loadWorkouts(); } catch (e) { console.log(e); } } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FloatingBackground scrollY={scrollY} />

        <Reanimated.FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <>
              {/* Hero */}
              <Reanimated.View entering={FadeInDown.duration(600).springify().damping(18)} style={[styles.heroOuter, heroAnimatedStyle]}>
                <HeroGlow />
                <BlurView intensity={32} tint="dark" style={styles.heroCard}>
                  <ShimmerLine />
                  <View style={styles.heroTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.heroBadge}>
                        <View style={styles.heroBadgeDot} />
                        <Text style={styles.heroBadgeText}>ATHLETE SYSTEM</Text>
                      </View>
                      <Text style={styles.heroTitle}>Train Like{"\n"}You Mean It</Text>
                      <Text style={styles.heroSubtitle}>Build strength, track performance, and make your routine feel elite.</Text>
                    </View>
                    <View style={styles.heroIconCircle}>
                      <MaterialCommunityIcons name="dumbbell" size={32} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.progressBarWrap}>
                    <View style={styles.progressBarBg}>
                      <Reanimated.View entering={FadeInDown.delay(800).duration(1000)} style={[styles.progressBarFill, { width: `${Math.min((totalWorkouts % 5) * 20, 100)}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>Level {level} · {totalWorkouts % 5}/5 to next</Text>
                  </View>
                </BlurView>
              </Reanimated.View>

              {/* Metrics */}
              <View style={styles.metricsRow}>
                <MetricCard label="Workouts" value={totalWorkouts} icon="barbell-outline" delay={100} accent="#A78BFA" />
                <MetricCard label="Calories"  value={totalCalories}  icon="flame-outline"   delay={180} accent="#F87171" />
              </View>
              <View style={styles.metricsRow}>
                <MetricCard label="Minutes"   value={totalMinutes}   icon="time-outline"    delay={260} accent="#34D399" />
                <MetricCard label="Level"     value={level}          icon="flash-outline"   delay={340} accent="#FBBF24" />
              </View>

              {/* Section header */}
              <Reanimated.View entering={FadeInDown.delay(420).duration(400)} style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Workout Feed</Text>
                <View style={styles.sectionPill}>
                  <Text style={styles.sectionHint}>{workouts.length} sessions</Text>
                </View>
              </Reanimated.View>
            </>
          }
          renderItem={({ item, index }) => (
            <WorkoutCard
              item={item}
              index={index}
              onDelete={handleDelete}
              onPress={() => stackNav.navigate("WorkoutDetail", { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <Reanimated.View entering={FadeInDown.delay(300).duration(500)}>
              <BlurView intensity={24} tint="dark" style={styles.emptyBox}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons name="run-fast" size={40} color="#A78BFA" />
                </View>
                <Text style={styles.emptyTitle}>No workout yet</Text>
                <Text style={styles.emptySubtitle}>Tap the + button and add your first session.</Text>
              </BlurView>
            </Reanimated.View>
          }
        />

        {/* FAB — navigates to the Add tab */}
        <FABButton onPress={() => tabNav.navigate("Add")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#05070D" },
  container: { flex: 1, backgroundColor: "#05070D" },
  listContent: { paddingHorizontal: 18, paddingBottom: 110 },

  bgIconWrap: { position: "absolute" },
  bgIcon1: { top: 80, left: -10 },
  bgIcon2: { top: 200, right: -18 },
  bgIcon3: { top: 380, left: 8 },

  heroOuter: { marginTop: 10, marginBottom: 18, borderRadius: 30, overflow: "visible" },
  heroGlowOuter: { position: "absolute", width: 320, height: 320, borderRadius: 160, top: -80, right: -60, overflow: "hidden", zIndex: 0 },
  heroGlowGradient: { width: "100%", height: "100%" },
  heroCard: { borderRadius: 30, padding: 22, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", zIndex: 1 },
  shimmerWrap: { position: "absolute", top: 0, bottom: 0, left: 0, width: width * 0.5, zIndex: 10 },
  shimmerGrad: { flex: 1, width: "100%" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ADE80" },
  heroBadgeText: { color: "#C4B5FD", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroTitle: { color: "#FFFFFF", fontSize: 34, lineHeight: 38, fontWeight: "900", marginTop: 10 },
  heroSubtitle: { color: "#A1A1AA", fontSize: 14, lineHeight: 22, marginTop: 12, maxWidth: "90%", fontWeight: "500" },
  heroIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(124,58,237,0.4)", borderWidth: 1, borderColor: "rgba(196,181,253,0.25)", alignItems: "center", justifyContent: "center", marginLeft: 12, marginTop: 8 },
  progressBarWrap: { marginTop: 20 },
  progressBarBg: { height: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 99, backgroundColor: "#7C3AED" },
  progressLabel: { color: "#71717A", fontSize: 11, fontWeight: "700", marginTop: 6, letterSpacing: 0.4 },

  metricsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  metricWrap: { flex: 1, borderRadius: 22, overflow: "visible" },
  metricGlowBorder: { borderRadius: 22, borderWidth: 1.5, zIndex: 2 },
  metricCard: { flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 14, borderRadius: 22, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", gap: 10 },
  metricIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  metricValue: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  metricLabel: { color: "#71717A", fontSize: 11, fontWeight: "700", marginTop: 2, letterSpacing: 0.3 },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 16 },
  sectionTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: -0.3 },
  sectionPill: { backgroundColor: "rgba(124,58,237,0.18)", borderWidth: 1, borderColor: "rgba(124,58,237,0.3)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  sectionHint: { color: "#C4B5FD", fontSize: 12, fontWeight: "700" },

  workoutOuter: { borderRadius: 24, overflow: "hidden", marginBottom: 14 },
  workoutCard: { borderRadius: 24, padding: 16, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
  workoutTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 8 },
  categoryBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  categoryBadgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  deleteBtn: { backgroundColor: "rgba(244,63,94,0.12)", padding: 8, borderRadius: 10 },
  workoutTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 14, paddingLeft: 8 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 14, paddingLeft: 8, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7, gap: 5 },
  metaChipText: { color: "#E4E4E7", fontSize: 12, fontWeight: "700" },
  dateText: { color: "#52525B", fontSize: 12, fontWeight: "600", marginTop: 12, paddingLeft: 8 },

  emptyBox: { borderRadius: 28, padding: 32, alignItems: "center", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  emptyIconWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(124,58,237,0.15)", borderWidth: 1, borderColor: "rgba(124,58,237,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  emptySubtitle: { color: "#71717A", fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 8 },

  fab: { position: "absolute", bottom: 28, right: 22, borderRadius: 30, shadowColor: "#7C3AED", shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  fabGrad: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
});