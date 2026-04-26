import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

function EnergyParticle({ delay, x }: { delay: number; x: number }) {
  const y = useSharedValue(40);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withSequence(
        withTiming(-90, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(40, { duration: 0 })
      )
    );

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 900 })
      )
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.3, { duration: 500 }),
        withTiming(0.4, { duration: 700 })
      )
    );
  }, []);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={[styles.particle, particleStyle]} />;
}

export default function SplashIntroScreen({ onFinish }: { onFinish: () => void }) {
  const loadingTexts = [
    "Warming up...",
    "Loading workout data...",
    "Charging energy...",
    "Ready to lift.",
  ];

  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  const dumbbellY = useSharedValue(80);
  const rotate = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.7);

  const glowScale = useSharedValue(0);
  const shockwaveScale = useSharedValue(0);
  const screenFade = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 700 });

    dumbbellY.value = withDelay(
      300,
      withSequence(
        withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(-45, { duration: 450 }),
        withTiming(0, { duration: 400 })
      )
    );

    rotate.value = withDelay(
      300,
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(18, { duration: 450 }),
        withTiming(0, { duration: 400 })
      )
    );

    glowScale.value = withDelay(900, withTiming(1, { duration: 600 }));
    shockwaveScale.value = withDelay(1400, withTiming(1, { duration: 700 }));
    screenFade.value = withDelay(2600, withTiming(0, { duration: 400 }));

    const textTimer = setInterval(() => {
      setLoadingText((current) => {
        const currentIndex = loadingTexts.indexOf(current);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 600);

    const timer = setTimeout(onFinish, 3050);

    return () => {
      clearTimeout(timer);
      clearInterval(textTimer);
    };
  }, []);

  const dumbbellStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: dumbbellY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowScale.value,
    transform: [{ scale: glowScale.value }],
  }));

  const shockwaveStyle = useAnimatedStyle(() => ({
    opacity: 1 - shockwaveScale.value,
    transform: [{ scale: 1 + shockwaveScale.value * 3 }],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenFade.value,
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <Text style={styles.small}>FITTRACK SYSTEM</Text>
      <Text style={styles.title}>Wake The Dumbbell</Text>

      <View style={styles.centerArea}>
        <EnergyParticle delay={700} x={-70} />
        <EnergyParticle delay={900} x={-30} />
        <EnergyParticle delay={1100} x={40} />
        <EnergyParticle delay={1300} x={80} />
        <EnergyParticle delay={1500} x={10} />

        <Animated.View style={[styles.shockwave, shockwaveStyle]} />
        <Animated.View style={[styles.glow, glowStyle]} />

        <Animated.View style={[styles.dumbbellBox, dumbbellStyle]}>
          <MaterialCommunityIcons name="dumbbell" size={110} color="#FFFFFF" />
        </Animated.View>
      </View>

      <Text style={styles.subtitle}>{loadingText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070D",
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 50,
  },
  centerArea: {
    width,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  dumbbellBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(124,58,237,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(124,58,237,0.35)",
  },
  shockwave: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: "rgba(167,139,250,0.8)",
  },
  particle: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#A78BFA",
  },
  subtitle: {
    color: "#A1A1AA",
    marginTop: 50,
    fontSize: 16,
    fontWeight: "600",
  },
});