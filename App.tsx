import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/database/db";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      initDatabase();
      setReady(true);
    } catch (error) {
      console.log("DB init error:", error);
    }
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

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