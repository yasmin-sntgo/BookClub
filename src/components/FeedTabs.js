import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";

export function FeedTabs({ activeTab, onChange }) {
  return (
    <View style={styles.wrap}>
      {["books", "reviews"].map((tab) => {
        const isActive = activeTab === tab;
        const label = tab === "books" ? "Livros" : "Resenhas";

        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            onPress={() => onChange(tab)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeText]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg
  },
  tab: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },
  activeTab: {
    borderBottomColor: colors.accent
  },
  tabText: {
    ...type.small,
    color: colors.textMuted,
    fontFamily: type.button.fontFamily,
    fontSize: 13
  },
  activeText: {
    color: colors.text
  }
});
