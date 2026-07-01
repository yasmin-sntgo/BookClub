import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, useWindowDimensions } from "react-native";

export function MascotTentacles() {
  const drift = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  const isWideScreen = width >= 700;
  const isShortScreen = height < 720;
  const imageWidth = isWideScreen
    ? Math.min(width * 0.54, 680)
    : Math.min(width * 1.22, 620);
  const imageHeight = imageWidth * (701 / 1080);
  const bottomOffset = isWideScreen ? -64 : isShortScreen ? -44 : -52;
  const opacity = isWideScreen ? 0.74 : 0.9;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [drift]);

  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-3, 3]
  });

  const scale = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015]
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          bottom: bottomOffset,
          width: imageWidth,
          height: imageHeight,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }]
        }
      ]}
    >
      <Animated.Image
        source={require("../../assets/mascot-tentacles.png")}
        resizeMode="contain"
        style={styles.image}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1
  },
  image: {
    width: "100%",
    height: "100%"
  }
});
