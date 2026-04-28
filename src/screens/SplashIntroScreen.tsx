import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashIntroScreen({ onFinish }: { onFinish: () => void }) {
  const [loadingText, setLoadingText] = useState("Entering dark gym...");

  const spotlight = useSharedValue(0);
  const athleteX = useSharedValue(-160);
  const athleteBend = useSharedValue(0);
  const armReach = useSharedValue(0);
  const liftPower = useSharedValue(0);

  const dumbbellGlow = useSharedValue(0);
  const dumbbellY = useSharedValue(0);
  const shockwave = useSharedValue(0);
  const finalRing = useSharedValue(0);
  const screenFade = useSharedValue(1);

  useEffect(() => {
    spotlight.value = withTiming(1, { duration: 900 });

    athleteX.value = withDelay(
      600,
      withTiming(width * 0.32, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      })
    );

    athleteBend.value = withDelay(1800, withTiming(1, { duration: 500 }));
    armReach.value = withDelay(1800, withTiming(1, { duration: 500 }));

    dumbbellGlow.value = withDelay(2200, withTiming(1, { duration: 500 }));

    liftPower.value = withDelay(
      2450,
      withSequence(
        withTiming(1, { duration: 450, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(0.8, { duration: 250 })
      )
    );

    dumbbellY.value = withDelay(
      2450,
      withSequence(
        withTiming(-95, {
          duration: 550,
          easing: Easing.out(Easing.back(1.4)),
        }),
        withTiming(-75, { duration: 250 })
      )
    );

    athleteBend.value = withDelay(2900, withTiming(0, { duration: 450 }));
    armReach.value = withDelay(2900, withTiming(0, { duration: 450 }));

    shockwave.value = withDelay(3150, withTiming(1, { duration: 800 }));
    finalRing.value = withDelay(3450, withTiming(1, { duration: 700 }));
    screenFade.value = withDelay(4200, withTiming(0, { duration: 450 }));

    const t1 = setTimeout(() => setLoadingText("Athlete entering..."), 800);
    const t2 = setTimeout(() => setLoadingText("Grabbing dumbbell..."), 1900);
    const t3 = setTimeout(() => setLoadingText("Power lift activated..."), 2500);
    const t4 = setTimeout(() => setLoadingText("Training mode ready."), 3300);
    const done = setTimeout(onFinish, 4700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(done);
    };
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenFade.value,
  }));

  const spotlightStyle = useAnimatedStyle(() => ({
    opacity: spotlight.value,
    transform: [{ scale: spotlight.value }],
  }));

  const athleteStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: athleteX.value },
      { translateY: athleteBend.value * 40 },
      { rotate: `${athleteBend.value * 25}deg` },
    ],
  }));

  const armRightStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-25 - armReach.value * 40}deg` },
      { translateY: armReach.value * 20 },
    ],
  }));

  const dumbbellStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: dumbbellY.value - liftPower.value * 20 },
      { scale: 1 + liftPower.value * 0.15 },
      { rotate: `${liftPower.value * 12}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: Math.min(dumbbellGlow.value + liftPower.value * 0.6, 1),
    transform: [
      {
        scale: 1 + dumbbellGlow.value * 0.5 + liftPower.value * 0.8,
      },
    ],
  }));

  const shockwaveStyle = useAnimatedStyle(() => ({
    opacity: 1 - shockwave.value,
    transform: [{ scale: 1 + shockwave.value * 4 }],
  }));

  const finalRingStyle = useAnimatedStyle(() => ({
    opacity: finalRing.value,
    transform: [{ scale: 0.2 + finalRing.value * 6 }],
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <View style={styles.wall} />
      <Animated.View style={[styles.spotlight, spotlightStyle]} />

      <View style={styles.floor}>
        <View style={styles.floorLine} />
      </View>

      <Text style={styles.brand}>FITTRACK SYSTEM</Text>
      <Text style={styles.title}>Wake The Dumbbell</Text>

      <Animated.View style={[styles.athlete, athleteStyle]}>
        <View style={styles.head} />
        <View style={styles.body} />
        <View style={styles.armLeft} />
        <Animated.View style={[styles.armRight, armRightStyle]} />
        <View style={styles.legLeft} />
        <View style={styles.legRight} />
      </Animated.View>

      <Animated.View style={[styles.shockwave, shockwaveStyle]} />
      <Animated.View style={[styles.finalRing, finalRingStyle]} />
      <Animated.View style={[styles.dumbbellGlow, glowStyle]} />

      <Animated.View style={[styles.dumbbell, dumbbellStyle]}>
        <MaterialCommunityIcons name="dumbbell" size={90} color="#FFFFFF" />
      </Animated.View>

      <Text style={styles.subtitle}>{loadingText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },
  wall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#05070D",
  },
  spotlight: {
    position: "absolute",
    top: 90,
    width: 260,
    height: 360,
    borderRadius: 140,
    backgroundColor: "rgba(167,139,250,0.18)",
  },
  floor: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.28,
    backgroundColor: "#09090B",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  floorLine: {
    marginTop: 42,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(167,139,250,0.22)",
  },
  brand: {
    position: "absolute",
    top: 95,
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    position: "absolute",
    top: 120,
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  athlete: {
    position: "absolute",
    bottom: height * 0.23,
    left: 0,
    width: 80,
    height: 160,
    alignItems: "center",
  },
  head: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  body: {
    width: 30,
    height: 62,
    borderRadius: 16,
    backgroundColor: "#111827",
    marginTop: 4,
  },
  armLeft: {
    position: "absolute",
    top: 48,
    left: 12,
    width: 12,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#111827",
    transform: [{ rotate: "25deg" }],
  },
  armRight: {
    position: "absolute",
    top: 48,
    right: 12,
    width: 12,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  legLeft: {
    position: "absolute",
    top: 96,
    left: 24,
    width: 13,
    height: 62,
    borderRadius: 8,
    backgroundColor: "#111827",
    transform: [{ rotate: "10deg" }],
  },
  legRight: {
    position: "absolute",
    top: 96,
    right: 24,
    width: 13,
    height: 62,
    borderRadius: 8,
    backgroundColor: "#111827",
    transform: [{ rotate: "-10deg" }],
  },
  dumbbell: {
    position: "absolute",
    bottom: height * 0.19,
  },
  dumbbellGlow: {
    position: "absolute",
    bottom: height * 0.18,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(124,58,237,0.35)",
  },
  shockwave: {
    position: "absolute",
    bottom: height * 0.2,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "rgba(167,139,250,0.8)",
  },
  finalRing: {
    position: "absolute",
    bottom: height * 0.2,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "rgba(124,58,237,0.9)",
  },
  subtitle: {
    position: "absolute",
    bottom: 65,
    color: "#A1A1AA",
    fontSize: 15,
    fontWeight: "700",
  },
});