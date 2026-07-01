import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { Icon } from "./Icon";

const items = [
  { id: "home", icon: "home", label: "Inicio" },
  { id: "library", icon: "books", label: "Estante" },
  { id: "lists", icon: "list", label: "Listas" },
  { id: "search", icon: "search", label: "Busca" }
];

export function BottomNav({ activeTab = "home", onChange, onCreate }) {
  return (
    <View style={styles.nav}>
      {items.slice(0, 2).map((item) => (
        <NavItem
          key={item.id}
          item={item}
          active={item.id === activeTab}
          onPress={() => onChange?.(item.id)}
        />
      ))}
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.addButton}>
        <Icon name="plus" size={24} color={colors.ink} strokeWidth={2.6} />
      </Pressable>
      {items.slice(2).map((item) => (
        <NavItem
          key={item.id}
          item={item}
          active={item.id === activeTab}
          onPress={() => onChange?.(item.id)}
        />
      ))}
    </View>
  );
}

function NavItem({ item, active, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.item}>
      <Icon name={item.icon} size={23} color={active ? colors.text : colors.textMuted} />
      <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    minHeight: 68,
    paddingVertical: 6,
    paddingHorizontal: 7,
    backgroundColor: "rgba(12,12,12,0.78)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.13)",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOpacity: 0.46,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 16
  },
  item: {
    width: 56,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    lineHeight: 11
  },
  activeLabel: {
    color: colors.text
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10
  }
});
