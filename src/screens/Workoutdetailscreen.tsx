import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Reanimated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { getWorkoutById, deleteWorkout } from "../database/workoutService";
import { Workout } from "../types/workout";
import { HomeStackParamList } from "../navigation/HomeStack";

const { width } = Dimensions.get("window");

type DetailRouteProp = RouteProp<HomeStackParamList, "WorkoutDetail">;
type DetailNavProp = NativeStackNavigationProp<HomeStackParamList, "WorkoutDetail">;

const CATEGORY_COLORS: Record<string, string> = {
  Strength: "#A78BFA", Cardio: "#34D399", Flexibility: "#60A5FA",
  HIIT: "#F87171", Sports: "#FBBF24", default: "#C4B5FD",
};

function AmbientOrb({ size, color, top, left, delay }: any) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.2, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.85, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Reanimated.View
      style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.16 }, style]}
      pointerEvents="none"
    />
  );
}

function StatBlock({ icon, label, value, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string }) {
  return (
    <Reanimated.View entering={FadeInDown.delay(250).duration(400).springify()} style={styles.statBlockOuter}>
      <BlurView intensity={28} tint="dark" style={styles.statBlock}>
        <View style={[styles.statBlockIcon, { backgroundColor: color + "22" }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.statBlockValue, { color }]}>{value}</Text>
        <Text style={styles.statBlockLabel}>{label}</Text>
      </BlurView>
    </Reanimated.View>
  );
}

export default function WorkoutDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { id } = route.params;

  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const data = getWorkoutById(id);
    setWorkout(data);
  }, [id]);

  const btnScale = useSharedValue(1);
  const editBtnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  if (!workout) return null;

  const accent = CATEGORY_COLORS[workout.category] ?? CATEGORY_COLORS.default;

  const handleDelete = () => {
    Alert.alert("Delete Workout", "Remove this session permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => { deleteWorkout(id); navigation.goBack(); }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AmbientOrb size={260} color={accent} top={-80} left={-60} delay={0} />
        <AmbientOrb size={180} color="#7C3AED" top={350} left={width - 80} delay={500} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Top bar */}
          <Reanimated.View entering={FadeInDown.duration(400).springify()} style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#C4B5FD" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Workout Detail</Text>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#FB7185" />
            </TouchableOpacity>
          </Reanimated.View>

          {/* Hero card */}
          <Reanimated.View entering={FadeInDown.delay(80).duration(500).springify().damping(16)} style={styles.heroOuter}>
            <LinearGradient
              colors={[accent + "33", accent + "11", "transparent"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <BlurView intensity={30} tint="dark" style={styles.heroCard}>
              {/* Accent top bar */}
              <View style={[styles.heroAccentBar, { backgroundColor: accent }]} />

              <View style={[styles.categoryBadge, { borderColor: accent + "55", backgroundColor: accent + "18" }]}>
                <Text style={[styles.categoryText, { color: accent }]}>{workout.category}</Text>
              </View>

              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.dateText}>📅 {workout.date}</Text>
            </BlurView>
          </Reanimated.View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatBlock icon="time-outline"    label="Duration" value={`${workout.duration}m`}   color="#A78BFA" />
            <StatBlock icon="flame-outline"   label="Calories" value={`${workout.calories}`}     color="#F87171" />
            <StatBlock icon="barbell-outline" label="Category" value={workout.category.slice(0,5)} color="#34D399" />
          </View>

          {/* Notes */}
          {workout.notes ? (
            <Reanimated.View entering={FadeInDown.delay(320).duration(400).springify()} style={styles.notesOuter}>
              <BlurView intensity={26} tint="dark" style={styles.notesCard}>
                <View style={styles.notesHeader}>
                  <Ionicons name="document-text-outline" size={16} color="#A78BFA" />
                  <Text style={styles.notesTitle}>Session Notes</Text>
                </View>
                <Text style={styles.notesText}>{workout.notes}</Text>
              </BlurView>
            </Reanimated.View>
          ) : null}

          {/* Actions */}
          <Reanimated.View entering={FadeInUp.delay(380).duration(450).springify()} style={styles.actionsCol}>

            {/* Edit */}
            <Reanimated.View style={editBtnStyle}>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => { btnScale.value = withSpring(0.97, { damping: 20 }); }}
                onPressOut={() => { btnScale.value = withSpring(1, { damping: 14 }); }}
                onPress={() => navigation.navigate("EditWorkout", {
                  id: workout.id,
                  title: workout.title,
                  category: workout.category,
                  duration: workout.duration,
                  calories: workout.calories,
                  date: workout.date,
                  notes: workout.notes,
                })}
              >
                <LinearGradient colors={["#7C3AED", "#6D28D9", "#4F1DBF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryBtn}>
                  <Ionicons name="pencil-outline" size={18} color="#fff" />
                  <Text style={styles.primaryBtnText}>Edit Workout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Reanimated.View>

            {/* Delete */}
            <TouchableOpacity onPress={handleDelete} style={styles.dangerBtn} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={18} color="#FB7185" />
              <Text style={styles.dangerBtnText}>Delete Workout</Text>
            </TouchableOpacity>

          </Reanimated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070D" },
  container: { flex: 1, backgroundColor: "#05070D" },
  scroll: { paddingHorizontal: 18, paddingBottom: 50, paddingTop: 10 },

  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  topBarTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  deleteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(244,63,94,0.1)", borderWidth: 1, borderColor: "rgba(244,63,94,0.2)", alignItems: "center", justifyContent: "center" },

  heroOuter: { borderRadius: 28, overflow: "hidden", marginBottom: 16 },
  heroCard: { borderRadius: 28, padding: 22, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  heroAccentBar: { height: 3, borderRadius: 99, marginBottom: 16, width: 48 },
  categoryBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignSelf: "flex-start", marginBottom: 12 },
  categoryText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  workoutTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 10 },
  dateText: { color: "#71717A", fontSize: 13, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statBlockOuter: { flex: 1, borderRadius: 18, overflow: "hidden" },
  statBlock: { borderRadius: 18, padding: 14, alignItems: "center", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  statBlockIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statBlockValue: { fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  statBlockLabel: { color: "#71717A", fontSize: 11, fontWeight: "700", marginTop: 4 },

  notesOuter: { borderRadius: 22, overflow: "hidden", marginBottom: 16 },
  notesCard: { borderRadius: 22, padding: 16, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  notesHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  notesTitle: { color: "#A78BFA", fontSize: 13, fontWeight: "800" },
  notesText: { color: "#D4D4D8", fontSize: 15, lineHeight: 24, fontWeight: "500" },

  actionsCol: { gap: 12 },
  primaryBtn: { paddingVertical: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: "#7C3AED", shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  dangerBtn: { paddingVertical: 14, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(244,63,94,0.1)", borderWidth: 1, borderColor: "rgba(244,63,94,0.2)" },
  dangerBtnText: { color: "#FB7185", fontSize: 15, fontWeight: "800" },
});