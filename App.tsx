import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/database/db";
import SplashIntroScreen from "./src/screens/SplashIntroScreen";

export default function App() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      initDatabase();
      setReady(true);
    } catch (error) {
      console.log("DB init error:", error);
    }
  }, []);

  // Loading while DB initializes
  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // Intro screen (first 2 seconds)
  if (showIntro) {
    return <SplashIntroScreen onFinish={() => setShowIntro(false)} />;
  }

  // Main App
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#05070D",
    justifyContent: "center",
    alignItems: "center",
  },
});