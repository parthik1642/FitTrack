import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../constants/colors";
import { getAllWorkouts, deleteWorkout } from "../database/workoutService";
import { Workout } from "../types/workout";
import { HomeStackParamList } from "../navigation/HomeStack";

function SummaryCard({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.summaryNumber}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </Animated.View>
  );
}

function WorkoutItem({
  item,
  onDelete,
  onPress,
}: {
  item: Workout;
  onDelete: (id: number) => void;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoText}>⏱ {item.duration} min</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoText}>🔥 {item.calories} cal</Text>
          </View>
        </View>

        <Text style={styles.cardDate}>{item.date}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFade, headerSlide]);

  const loadWorkouts = () => {
    try {
      const data = getAllWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.log("Error loading workouts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const totalWorkouts = workouts.length;

  const totalCalories = useMemo(() => {
    return workouts.reduce((sum, item) => sum + item.calories, 0);
  }, [workouts]);

  const totalMinutes = useMemo(() => {
    return workouts.reduce((sum, item) => sum + item.duration, 0);
  }, [workouts]);

  const handleDelete = (id: number) => {
    Alert.alert("Delete Workout", "Are you sure you want to delete this workout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          try {
            deleteWorkout(id);
            loadWorkouts();
          } catch (error) {
            console.log("Delete error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: headerFade,
          transform: [{ translateY: headerSlide }],
        }}
      >
        <Text style={styles.greeting}>Welcome back 👋</Text>
        <Text style={styles.title}>FitTrack Dashboard</Text>
      </Animated.View>

      <View style={styles.summaryRow}>
        <SummaryCard value={totalWorkouts} label="Workouts" delay={100} />
        <SummaryCard value={totalCalories} label="Calories" delay={180} />
        <SummaryCard value={totalMinutes} label="Minutes" delay={260} />
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>

      {workouts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No workouts added yet.</Text>
          <Text style={styles.emptySubtext}>Start by adding your first workout.</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <WorkoutItem
              item={item}
              onDelete={handleDelete}
              onPress={() =>
                navigation.navigate("EditWorkout", {
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  duration: item.duration,
                  calories: item.calories,
                  date: item.date,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  greeting: {
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 22,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  summaryNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 6,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
  },
  emptyBox: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  category: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  infoPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600",
  },
  cardDate: {
    marginTop: 14,
    fontSize: 13,
    color: Colors.muted,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: Colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
});