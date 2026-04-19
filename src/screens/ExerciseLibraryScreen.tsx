import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Reanimated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { exercises } from "../constants/exercises";
import { Exercise } from "../types/exercise";

const { width } = Dimensions.get("window");

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#F87171",
  Legs: "#34D399",
  Back: "#60A5FA",
  Arms: "#FBBF24",
  Shoulders: "#A78BFA",
  "Full Body": "#FB923C",
  Core: "#F472B6",
};

const CATEGORY_ICON: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Strength: "dumbbell",
  Cardio: "run-fast",
  Flexibility: "human-handsup",
};

function AmbientOrb({ size, color, top, left, delay }: any) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.25, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.8, { duration: 3500, easing: Easing.inOut(Easing.sin) })
    ), -1, true));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Reanimated.View
      style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.13 }, style]}
      pointerEvents="none"
    />
  );
}

function ExerciseCard({ item, index }: { item: Exercise; index: number }) {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const accent = MUSCLE_COLORS[item.muscle] ?? "#A78BFA";
  const iconName = CATEGORY_ICON[item.category] ?? "dumbbell";

  return (
    <Reanimated.View
      entering={FadeInDown.delay(index * 55).duration(420).springify().damping(16)}
      style={cardStyle}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { scale.value = withSpring(0.975, { damping: 20, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
        style={styles.cardOuter}
      >
        <BlurView intensity={28} tint="dark" style={styles.card}>
          {/* Left accent bar */}
          <View style={[styles.accentBar, { backgroundColor: accent }]} />

          <View style={styles.cardInner}>
            <View style={[styles.iconCircle, { backgroundColor: accent + "22" }]}>
              <MaterialCommunityIcons name={iconName} size={20} color={accent} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.tagsRow}>
                <View style={[styles.tag, { borderColor: accent + "55", backgroundColor: accent + "15" }]}>
                  <Text style={[styles.tagText, { color: accent }]}>{item.muscle}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.equipment}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.categoryPill, { backgroundColor: accent + "18" }]}>
              <Text style={[styles.categoryPillText, { color: accent }]}>{item.category}</Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export default function ExerciseLibraryScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({ onScroll: (e) => { scrollY.value = e.contentOffset.y; } });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 80], [0, -10], "clamp") }],
    opacity: interpolate(scrollY.value, [0, 100], [1, 0.9], "clamp"),
  }));

  const filters = ["All", "Strength", "Cardio", "Flexibility"];

  const filtered = exercises.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase()) || e.muscle.toLowerCase().includes(query.toLowerCase());
    const matchFilter = activeFilter === "All" || e.category === activeFilter;
    return matchQuery && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <AmbientOrb size={250} color="#2563EB" top={-60} left={-60} delay={0} />
        <AmbientOrb size={180} color="#7C3AED" top={250} left={width - 80} delay={800} />

        <Reanimated.FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <Reanimated.View style={headerStyle}>
                <Reanimated.View entering={FadeInDown.duration(500).springify().damping(18)}>
                  <View style={styles.heroBadge}>
                    <View style={styles.heroDot} />
                    <Text style={styles.heroMini}>BROWSE & LEARN</Text>
                  </View>
                  <Text style={styles.heading}>Exercise Library</Text>
                  <Text style={styles.subheading}>{exercises.length} exercises across all categories</Text>
                </Reanimated.View>

                {/* Search */}
                <Reanimated.View entering={FadeInDown.delay(120).duration(400).springify()} style={styles.searchWrap}>
                  <BlurView intensity={30} tint="dark" style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#71717A" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search exercises or muscle..."
                      placeholderTextColor="#3F3F46"
                      value={query}
                      onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                      <TouchableOpacity onPress={() => setQuery("")}>
                        <Ionicons name="close-circle" size={18} color="#71717A" />
                      </TouchableOpacity>
                    )}
                  </BlurView>
                </Reanimated.View>

                {/* Filter chips */}
                <Reanimated.View entering={FadeInDown.delay(200).duration(400)} style={styles.filtersRow}>
                  {filters.map((f) => {
                    const active = activeFilter === f;
                    return (
                      <TouchableOpacity
                        key={f}
                        onPress={() => setActiveFilter(f)}
                        style={[styles.filterChip, active && styles.filterChipActive]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{f}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </Reanimated.View>

                <Reanimated.View entering={FadeInDown.delay(260).duration(400)} style={styles.resultsRow}>
                  <Text style={styles.resultsText}>{filtered.length} results</Text>
                </Reanimated.View>
              </Reanimated.View>
            </>
          }
          renderItem={({ item, index }) => <ExerciseCard item={item} index={index} />}
          ListEmptyComponent={
            <Reanimated.View entering={FadeInDown.delay(200).duration(400)} style={styles.emptyWrap}>
              <BlurView intensity={24} tint="dark" style={styles.emptyBox}>
                <MaterialCommunityIcons name="magnify" size={38} color="#A78BFA" />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try a different search or filter.</Text>
              </BlurView>
            </Reanimated.View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070D" },
  container: { flex: 1, backgroundColor: "#05070D" },
  listContent: { paddingHorizontal: 18, paddingBottom: 30, paddingTop: 10 },

  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#60A5FA" },
  heroMini: { color: "#93C5FD", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  heading: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", letterSpacing: -0.5, marginTop: 4 },
  subheading: { color: "#71717A", fontSize: 14, marginTop: 6, marginBottom: 18, fontWeight: "500" },

  searchWrap: { marginBottom: 14, borderRadius: 16, overflow: "hidden" },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 16, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  searchInput: { flex: 1, color: "#FFFFFF", fontSize: 15, fontWeight: "500" },

  filtersRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  filterChipActive: { borderColor: "#60A5FA", backgroundColor: "rgba(96,165,250,0.18)" },
  filterChipText: { color: "#71717A", fontSize: 12, fontWeight: "700" },
  filterChipTextActive: { color: "#93C5FD" },

  resultsRow: { marginBottom: 10 },
  resultsText: { color: "#52525B", fontSize: 12, fontWeight: "700" },

  cardOuter: { borderRadius: 22, overflow: "hidden", marginBottom: 12 },
  card: {
    borderRadius: 22, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 22, borderBottomLeftRadius: 22 },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 14, paddingLeft: 18, gap: 12 },
  iconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginBottom: 6 },
  tagsRow: { flexDirection: "row", gap: 6 },
  tag: {
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  tagText: { color: "#A1A1AA", fontSize: 11, fontWeight: "700" },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  categoryPillText: { fontSize: 11, fontWeight: "800" },

  emptyWrap: { marginTop: 40 },
  emptyBox: {
    borderRadius: 28, padding: 32, alignItems: "center", overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  emptyTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginTop: 12 },
  emptySubtitle: { color: "#71717A", fontSize: 14, marginTop: 6 },
});