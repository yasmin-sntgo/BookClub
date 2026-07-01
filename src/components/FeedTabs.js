import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    padding: 3,
    gap: 3
  },
  tab: {
    flex: 1,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11
  },
  activeTab: {
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  tabText: {
    ...type.small,
    color: colors.textMuted,
    fontFamily: type.button.fontFamily
  },
  activeText: {
    color: colors.text
  }
});
