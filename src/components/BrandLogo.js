import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";

export function BrandLogo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.logoName}>
        B<Text style={styles.logoMark}>oo</Text>kClub
      </Text>
      <Text style={styles.tagline}>leia, sinta, compartilhe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: "center",
    marginBottom: spacing.xl
  },
  logoName: {
    ...type.logo,
    color: colors.text,
    textTransform: "uppercase"
  },
  logoMark: {
    color: colors.accent,
    fontFamily: type.logo.fontFamily
  },
  tagline: {
    ...type.smallItalic,
    color: colors.textMuted,
    marginTop: 2
  }
});
