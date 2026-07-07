import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Icon } from "./Icon";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function SpoilerText({ hasSpoiler = false, numberOfLines, onReveal, revealed: controlledRevealed, style, text }) {
  const [localRevealed, setLocalRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0.04)).current;
  const revealed = controlledRevealed ?? localRevealed;

  useEffect(() => {
    if (controlledRevealed === false) {
      setLocalRevealed(false);
      setRevealing(false);
      overlayOpacity.setValue(1);
      textOpacity.setValue(0.04);
    }
  }, [controlledRevealed, overlayOpacity, text, textOpacity]);

  if (!hasSpoiler || revealed) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={(event) => {
        event.stopPropagation?.();
        if (revealing) {
          return;
        }

        setRevealing(true);
        Animated.parallel([
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true
          })
        ]).start(() => {
          setLocalRevealed(true);
          onReveal?.();
        });
      }}
      style={styles.wrap}
    >
      <Animated.Text style={[style, styles.hiddenText, { opacity: textOpacity }]} numberOfLines={numberOfLines}>
        {text}
      </Animated.Text>
      <Animated.View style={[styles.overlayLayer, { opacity: overlayOpacity }]}>
        <LinearGradient
          colors={["rgba(14,14,14,0.98)", "rgba(31,26,21,0.96)", "rgba(17,17,17,0.98)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overlay}
        >
          <View style={styles.iconBadge}>
            <Icon name="starOutline" color={colors.warm} size={18} strokeWidth={2.2} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.label}>Spoiler</Text>
            <Text style={styles.hint}>toque para revelar a resenha</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 18,
    minHeight: 92,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(196,145,74,0.28)"
  },
  hiddenText: {
    padding: spacing.md
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196,145,74,0.14)",
    borderWidth: 1,
    borderColor: "rgba(196,145,74,0.32)"
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  label: {
    color: colors.warm,
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 25,
    textTransform: "uppercase"
  },
  hint: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  }
});
