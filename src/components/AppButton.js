import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { shadows } from "../theme/shadows";
import { type } from "../theme/typography";

export function AppButton({ children, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    ...shadows.button
  },
  pressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: colors.accentStrong
  },
  text: {
    ...type.button,
    color: colors.ink,
    textTransform: "uppercase"
  }
});
