import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Animated } from "react-native";
import { Colors } from "../constants/colors";
import { exercises } from "../constants/exercises";

export default function ExerciseLibraryScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          flex: 1,
        }}
      >
        <Text style={styles.subheading}>Browse exercises</Text>
        <Text style={styles.heading}>Exercise Library</Text>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>Category: {item.category}</Text>
              <Text style={styles.cardText}>Muscle: {item.muscle}</Text>
              <Text style={styles.cardText}>Equipment: {item.equipment}</Text>
            </View>
          )}
        />
      </Animated.View>
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
  subheading: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 4,
  },
});