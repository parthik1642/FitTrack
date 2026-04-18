import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet } from "react-native";

import HomeStack from "./HomeStack";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Colors } from "../constants/colors";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          if (route.name === "Library") iconName = "book";
          if (route.name === "Add") iconName = "add-circle";
          if (route.name === "Progress") iconName = "stats-chart";
          if (route.name === "Profile") iconName = "person";

          if (focused) {
            return (
              <View style={styles.activeIconWrap}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Library" component={ExerciseLibraryScreen} />
      <Tab.Screen name="Add" component={AddWorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 74,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: Colors.tabBg,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  activeIconWrap: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
});