import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { shadows } from "../theme/shadows";

export function AuthCard({ children }) {
  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={["rgba(255,255,255,0.055)", "rgba(255,255,255,0.018)"]}
        style={styles.card}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: "100%",
    ...shadows.card
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 24,
    backgroundColor: colors.card,
    overflow: "hidden"
  }
});
