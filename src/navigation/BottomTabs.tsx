import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

import HomeStack from "./HomeStack";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#A78BFA",
        tabBarInactiveTintColor: "#52525B",
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
          letterSpacing: 0.3,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home:     focused ? "home"        : "home-outline",
            Library:  focused ? "book"        : "book-outline",
            Add:      focused ? "add-circle"  : "add-circle-outline",
            Progress: focused ? "stats-chart" : "stats-chart-outline",
            Profile:  focused ? "person"      : "person-outline",
          };
          const iconName = icons[route.name] ?? "home-outline";

          if (route.name === "Add") {
            return (
              <View style={styles.addIconWrap}>
                <Ionicons name="add" size={26} color="#fff" />
              </View>
            );
          }
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
      <Tab.Screen name="Home"     component={HomeStack} />
      <Tab.Screen name="Library"  component={ExerciseLibraryScreen} />
      <Tab.Screen name="Add"      component={AddWorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    paddingTop: 10,
    backgroundColor: "rgba(5,7,13,0.92)",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.06)",
    elevation: 0,
  },
  activeIconWrap: {
    backgroundColor: "rgba(124,58,237,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  addIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});