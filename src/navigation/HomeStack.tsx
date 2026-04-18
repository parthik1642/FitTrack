import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import EditWorkoutScreen from "../screens/EditWorkoutScreen";

export type HomeStackParamList = {
  HomeMain: undefined;
  EditWorkout: {
    id: number;
    title: string;
    category: string;
    duration: number;
    calories: number;
    date: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditWorkout"
        component={EditWorkoutScreen}
        options={{ title: "Edit Workout" }}
      />
    </Stack.Navigator>
  );
}