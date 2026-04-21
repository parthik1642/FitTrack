import React, { useState, useEffect } from "react";
import {
  Text, StyleSheet, TextInput, TouchableOpacity, Alert,
  View, KeyboardAvoidingView, Platform, ScrollView, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Reanimated, {
  FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withDelay, withRepeat, withSequence, Easing,
} from "react-native-reanimated";
import { updateWorkout } from "../database/workoutService";
import { HomeStackParamList } from "../navigation/HomeStack";

const { width } = Dimensions.get("window");
const CATEGORIES = ["Strength", "Cardio", "HIIT", "Flexibility", "Sports"];

type EditRouteProp = RouteProp<HomeStackParamList, "EditWorkout">;
type EditNavProp = NativeStackNavigationProp<HomeStackParamList, "EditWorkout">;

function AmbientOrb({ size, color, top, left, delay }: any) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.2, { duration: 3800, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.85, { duration: 3200, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Reanimated.View style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.14 }, style]} pointerEvents="none" />;
}

function AnimatedField({ label, icon, delay, children }: { label: string; icon: keyof typeof Ionicons.glyphMap; delay: number; children: React.ReactNode }) {
  return (
    <Reanimated.View entering={FadeInDown.delay(delay).duration(400).springify().damping(16)} style={styles.fieldWrap}>
      <View style={styles.fieldLabelRow}>
        <Ionicons name={icon} size={14} color="#A78BFA" />
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </Reanimated.View>
  );
}

export default function EditWorkoutScreen() {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation<EditNavProp>();
  const { id, title, category, duration, calories, date, notes } = route.params;

  const [newTitle, setNewTitle] = useState(title);
  const [newCategory, setNewCategory] = useState(category);
  const [newDuration, setNewDuration] = useState(String(duration));
  const [newCalories, setNewCalories] = useState(String(calories));
  const [newDate, setNewDate] = useState(date);
  const [newNotes, setNewNotes] = useState(notes ?? "");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const btnScale = useSharedValue(1);
  const btnOpacity = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }], opacity: btnOpacity.value }));

  const handleUpdate = () => {
    if (!newTitle || !newCategory || !newDuration || !newCalories || !newDate) {
      Alert.alert("Missing fields", "Please fill all required fields.");
      return;
    }
    try {
      updateWorkout(id, { title: newTitle, category: newCategory, duration: Number(newDuration), calories: Number(newCalories), date: newDate, notes: newNotes });
      Alert.alert("✅ Updated!", "Workout saved.");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Failed to update workout.");
    }
  };

  const inputStyle = (field: string) => [styles.input, focusedField === field && styles.inputFocused];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AmbientOrb size={240} color="#7C3AED" top={-70} left={width - 100} delay={0} />
        <AmbientOrb size={160} color="#059669" top={350} left={-40} delay={500} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            <Reanimated.View entering={FadeInDown.duration(450).springify().damping(18)} style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={22} color="#C4B5FD" />
              </TouchableOpacity>
              <View>
                <Text style={styles.heroMini}>EDIT SESSION</Text>
                <Text style={styles.heading}>Edit Workout</Text>
              </View>
            </Reanimated.View>

            <Reanimated.View entering={FadeInDown.delay(100).duration(500).springify().damping(16)} style={styles.cardOuter}>
              <BlurView intensity={35} tint="dark" style={styles.card}>

                <AnimatedField label="Workout Title" icon="barbell-outline" delay={150}>
                  <TextInput style={inputStyle("title")} value={newTitle} onChangeText={setNewTitle} placeholderTextColor="#3F3F46" onFocus={() => setFocusedField("title")} onBlur={() => setFocusedField(null)} />
                </AnimatedField>

                <AnimatedField label="Category" icon="grid-outline" delay={200}>
                  <View style={styles.chipsRow}>
                    {CATEGORIES.map((cat) => {
                      const active = newCategory === cat;
                      return (
                        <TouchableOpacity key={cat} onPress={() => setNewCategory(cat)} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.75}>
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TextInput style={[inputStyle("category"), { marginTop: 8 }]} value={newCategory} onChangeText={setNewCategory} placeholder="Or type custom" placeholderTextColor="#3F3F46" onFocus={() => setFocusedField("category")} onBlur={() => setFocusedField(null)} />
                </AnimatedField>

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <AnimatedField label="Duration (min)" icon="time-outline" delay={260}>
                      <TextInput style={inputStyle("duration")} value={newDuration} onChangeText={setNewDuration} keyboardType="numeric" placeholderTextColor="#3F3F46" onFocus={() => setFocusedField("duration")} onBlur={() => setFocusedField(null)} />
                    </AnimatedField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AnimatedField label="Calories" icon="flame-outline" delay={300}>
                      <TextInput style={inputStyle("calories")} value={newCalories} onChangeText={setNewCalories} keyboardType="numeric" placeholderTextColor="#3F3F46" onFocus={() => setFocusedField("calories")} onBlur={() => setFocusedField(null)} />
                    </AnimatedField>
                  </View>
                </View>

                <AnimatedField label="Date" icon="calendar-outline" delay={340}>
                  <TextInput style={inputStyle("date")} value={newDate} onChangeText={setNewDate} placeholder="YYYY-MM-DD" placeholderTextColor="#3F3F46" onFocus={() => setFocusedField("date")} onBlur={() => setFocusedField(null)} />
                </AnimatedField>

                <AnimatedField label="Notes (optional)" icon="document-text-outline" delay={380}>
                  <TextInput
                    style={[inputStyle("notes"), { height: 90, textAlignVertical: "top" }]}
                    placeholder="How did it go?"
                    placeholderTextColor="#3F3F46"
                    value={newNotes}
                    onChangeText={setNewNotes}
                    multiline
                    onFocus={() => setFocusedField("notes")}
                    onBlur={() => setFocusedField(null)}
                  />
                </AnimatedField>

                <Reanimated.View entering={FadeInUp.delay(420).duration(400)} style={[styles.btnWrap, btnStyle]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleUpdate}
                    onPressIn={() => { btnScale.value = withSpring(0.97, { damping: 20 }); btnOpacity.value = withTiming(0.88, { duration: 80 }); }}
                    onPressOut={() => { btnScale.value = withSpring(1, { damping: 14 }); btnOpacity.value = withTiming(1, { duration: 120 }); }}
                  >
                    <LinearGradient colors={["#7C3AED", "#6D28D9", "#4F1DBF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                      <Ionicons name="save-outline" size={20} color="#fff" />
                      <Text style={styles.btnText}>Update Workout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Reanimated.View>

              </BlurView>
            </Reanimated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070D" },
  container: { flex: 1, backgroundColor: "#05070D" },
  scroll: { paddingHorizontal: 18, paddingBottom: 40, paddingTop: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 22 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  heroMini: { color: "#C4B5FD", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heading: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  cardOuter: { borderRadius: 28, overflow: "hidden" },
  card: { borderRadius: 28, padding: 20, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  fieldWrap: { marginBottom: 16 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { color: "#A1A1AA", fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: "#FFFFFF", fontWeight: "600" },
  inputFocused: { borderColor: "rgba(124,58,237,0.6)", backgroundColor: "rgba(124,58,237,0.06)" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" },
  chipActive: { borderColor: "#7C3AED", backgroundColor: "rgba(124,58,237,0.2)" },
  chipText: { color: "#71717A", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: "#C4B5FD" },
  row: { flexDirection: "row" },
  btnWrap: { marginTop: 6 },
  btn: { paddingVertical: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: "#7C3AED", shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});