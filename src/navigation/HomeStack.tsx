import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import EditWorkoutScreen from "../screens/EditWorkoutScreen";
import WorkoutDetailScreen from "../screens/Workoutdetailscreen";

export type HomeStackParamList = {
  HomeMain: undefined;
  EditWorkout: {
    id: number;
    title: string;
    category: string;
    duration: number;
    calories: number;
    date: string;
    notes?: string;
  };
  WorkoutDetail: {
    id: number;
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
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditWorkout"
        component={EditWorkoutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}