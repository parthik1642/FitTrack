import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../constants/colors";
import { updateWorkout } from "../database/workoutService";
import { HomeStackParamList } from "../navigation/HomeStack";

type EditRouteProp = RouteProp<HomeStackParamList, "EditWorkout">;
type EditNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "EditWorkout"
>;

export default function EditWorkoutScreen() {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation<EditNavigationProp>();

  const { id, title, category, duration, calories, date } = route.params;

  const [newTitle, setNewTitle] = useState(title);
  const [newCategory, setNewCategory] = useState(category);
  const [newDuration, setNewDuration] = useState(String(duration));
  const [newCalories, setNewCalories] = useState(String(calories));
  const [newDate, setNewDate] = useState(date);

  const handleUpdate = () => {
    if (!newTitle || !newCategory || !newDuration || !newCalories || !newDate) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    try {
      updateWorkout(id, {
        title: newTitle,
        category: newCategory,
        duration: Number(newDuration),
        calories: Number(newCalories),
        date: newDate,
      });

      Alert.alert("Success", "Workout updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update workout.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subheading}>Update your workout details</Text>
      <Text style={styles.heading}>Edit Workout</Text>

      <Text style={styles.label}>Workout Title</Text>
      <TextInput
        style={styles.input}
        value={newTitle}
        onChangeText={setNewTitle}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory}
      />

      <Text style={styles.label}>Duration</Text>
      <TextInput
        style={styles.input}
        value={newDuration}
        onChangeText={setNewDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Calories</Text>
      <TextInput
        style={styles.input}
        value={newCalories}
        onChangeText={setNewCalories}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={newDate}
        onChangeText={setNewDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 30,
  },
  subheading: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});