import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";
import { Icon } from "./Icon";

const actions = [
  {
    id: "review",
    icon: "comment",
    title: "Resenha"
  },
  {
    id: "rating",
    icon: "starOutline",
    title: "Avaliar"
  },
  {
    id: "shelf",
    icon: "books",
    title: "Estante"
  },
  {
    id: "list",
    icon: "list",
    title: "Lista"
  }
];

export function CreateActionSheet({ visible, onClose }) {
  const sheetProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      sheetProgress.setValue(0);
      return;
    }

    Animated.spring(sheetProgress, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 4
    }).start();
  }, [sheetProgress, visible]);

  function selectAction(actionId) {
    onClose(actionId);
  }

  const sheetStyle = {
    opacity: sheetProgress,
    transform: [
      {
        translateY: sheetProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [28, 0]
        })
      },
      {
        scale: sheetProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1]
        })
      }
    ]
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />

          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => selectAction(action.id)}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
              >
                <Icon name={action.icon} color={colors.accent} size={24} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  sheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderRadius: 28,
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.58,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 40,
    elevation: 24
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    position: "relative",
    zIndex: 1
  },
  action: {
    flex: 1,
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  actionPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: "rgba(157,192,216,0.08)",
    borderColor: "rgba(157,192,216,0.2)"
  },
  actionTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center"
  }
});
