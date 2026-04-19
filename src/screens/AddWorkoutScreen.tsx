import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
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
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { addWorkout } from "../database/workoutService";

const { width } = Dimensions.get("window");

const CATEGORIES = ["Strength", "Cardio", "HIIT", "Flexibility", "Sports"];

// Ambient orb (reuse pattern from HomeScreen)
function AmbientOrb({ size, color, top, left, delay }: any) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.85, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Reanimated.View
      style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.15 }, style]}
      pointerEvents="none"
    />
  );
}

// Animated field focus ring
function AnimatedField({
  label,
  icon,
  delay,
  children,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  delay: number;
  children: React.ReactNode;
}) {
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

export default function AddWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const btnScale = useSharedValue(1);
  const btnOpacity = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
    opacity: btnOpacity.value,
  }));

  const handleSave = () => {
    if (!title || !category || !duration || !calories || !date) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }
    try {
      addWorkout({ title, category, duration: Number(duration), calories: Number(calories), date });
      Alert.alert("🎉 Saved!", "Workout logged successfully.");
      setTitle(""); setCategory(""); setDuration(""); setCalories(""); setDate("");
    } catch {
      Alert.alert("Error", "Failed to save workout.");
    }
  };

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* Ambient background */}
        <AmbientOrb size={260} color="#7C3AED" top={-80} left={-60} delay={0} />
        <AmbientOrb size={180} color="#2563EB" top={300} left={width - 80} delay={600} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            {/* Header */}
            <Reanimated.View entering={FadeInDown.duration(500).springify().damping(18)}>
              <View style={styles.heroBadge}>
                <View style={styles.heroDot} />
                <Text style={styles.heroMini}>LOG SESSION</Text>
              </View>
              <Text style={styles.heading}>Add Workout</Text>
              <Text style={styles.subheading}>Track today's session and build your streak.</Text>
            </Reanimated.View>

            {/* Form Card */}
            <Reanimated.View entering={FadeInDown.delay(150).duration(500).springify().damping(16)} style={styles.cardOuter}>
              <BlurView intensity={35} tint="dark" style={styles.card}>

                <AnimatedField label="Workout Title" icon="barbell-outline" delay={200}>
                  <TextInput
                    style={inputStyle("title")}
                    placeholder="e.g. Push Day, Morning Run"
                    placeholderTextColor="#3F3F46"
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                  />
                </AnimatedField>

                {/* Category chips */}
                <AnimatedField label="Category" icon="grid-outline" delay={260}>
                  <View style={styles.chipsRow}>
                    {CATEGORIES.map((cat) => {
                      const active = category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategory(cat)}
                          style={[styles.chip, active && styles.chipActive]}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {/* Also allow manual input */}
                  <TextInput
                    style={[inputStyle("category"), { marginTop: 8 }]}
                    placeholder="Or type custom category"
                    placeholderTextColor="#3F3F46"
                    value={category}
                    onChangeText={setCategory}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                  />
                </AnimatedField>

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <AnimatedField label="Duration (min)" icon="time-outline" delay={320}>
                      <TextInput
                        style={inputStyle("duration")}
                        placeholder="45"
                        placeholderTextColor="#3F3F46"
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="numeric"
                        onFocus={() => setFocusedField("duration")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </AnimatedField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AnimatedField label="Calories" icon="flame-outline" delay={360}>
                      <TextInput
                        style={inputStyle("calories")}
                        placeholder="320"
                        placeholderTextColor="#3F3F46"
                        value={calories}
                        onChangeText={setCalories}
                        keyboardType="numeric"
                        onFocus={() => setFocusedField("calories")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </AnimatedField>
                  </View>
                </View>

                <AnimatedField label="Date" icon="calendar-outline" delay={400}>
                  <TextInput
                    style={inputStyle("date")}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#3F3F46"
                    value={date}
                    onChangeText={setDate}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                  />
                </AnimatedField>

                {/* Save Button */}
                <Reanimated.View entering={FadeInUp.delay(460).duration(400)} style={[styles.btnWrap, btnStyle]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleSave}
                    onPressIn={() => {
                      btnScale.value = withSpring(0.97, { damping: 20 });
                      btnOpacity.value = withTiming(0.88, { duration: 80 });
                    }}
                    onPressOut={() => {
                      btnScale.value = withSpring(1, { damping: 14 });
                      btnOpacity.value = withTiming(1, { duration: 120 });
                    }}
                  >
                    <LinearGradient
                      colors={["#7C3AED", "#6D28D9", "#4F1DBF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btn}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.btnText}>Save Workout</Text>
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

  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ADE80" },
  heroMini: { color: "#C4B5FD", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heading: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginTop: 6, letterSpacing: -0.5 },
  subheading: { color: "#71717A", fontSize: 14, marginTop: 6, marginBottom: 22, fontWeight: "500" },

  cardOuter: { borderRadius: 28, overflow: "hidden" },
  card: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },

  fieldWrap: { marginBottom: 16 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { color: "#A1A1AA", fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },

  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inputFocused: {
    borderColor: "rgba(124,58,237,0.6)",
    backgroundColor: "rgba(124,58,237,0.06)",
  },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipActive: { borderColor: "#7C3AED", backgroundColor: "rgba(124,58,237,0.2)" },
  chipText: { color: "#71717A", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: "#C4B5FD" },

  row: { flexDirection: "row" },

  btnWrap: { marginTop: 6 },
  btn: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});