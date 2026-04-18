import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  Animated,
} from "react-native";
import { Colors } from "../constants/colors";
import { addWorkout } from "../database/workoutService";

export default function AddWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  const handleSave = () => {
    if (!title || !category || !duration || !calories || !date) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    try {
      addWorkout({
        title,
        category,
        duration: Number(duration),
        calories: Number(calories),
        date,
      });

      Alert.alert("Success", "Workout saved successfully!");
      setTitle("");
      setCategory("");
      setDuration("");
      setCalories("");
      setDate("");
    } catch (error) {
      Alert.alert("Error", "Failed to save workout.");
      console.log(error);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.subheading}>Track today’s session</Text>
        <Text style={styles.heading}>Add Workout</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Workout Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Push Day"
            placeholderTextColor={Colors.muted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chest, Cardio"
            placeholderTextColor={Colors.muted}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="Minutes"
            placeholderTextColor={Colors.muted}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            placeholder="Calories"
            placeholderTextColor={Colors.muted}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.muted}
            value={date}
            onChangeText={setDate}
          />

          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
              marginTop: 14,
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              activeOpacity={0.95}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Save Workout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 22,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 17,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },
});