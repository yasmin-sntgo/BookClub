import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Icon } from "./Icon";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function TextFeedbackSheet({
  visible,
  title,
  description,
  initialText = "",
  placeholder = "Descreva o que aconteceu...",
  submitLabel = "Enviar",
  onClose,
  onSubmit
}) {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;

  useEffect(() => {
    if (visible) {
      setText(initialText);
    }
  }, [initialText, visible]);

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    onSubmit?.(text.trim());
    setText("");
  }

  function handleClose() {
    setText("");
    onClose?.();
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        style={styles.keyboard}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
            <TextInput
              multiline
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              style={styles.input}
            />
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={handleClose} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!canSubmit}
                onPress={handleSubmit}
                style={[styles.primaryButton, !canSubmit && styles.disabledButton]}
              >
                <Text style={[styles.primaryText, !canSubmit && styles.disabledText]}>{submitLabel}</Text>
                <Icon name="send" color={canSubmit ? colors.ink : colors.textMuted} size={17} strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  sheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderRadius: 28,
    maxHeight: "86%",
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)"
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: spacing.md
  },
  input: {
    minHeight: 154,
    borderRadius: 20,
    padding: spacing.md,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    backgroundColor: colors.accent
  },
  disabledButton: {
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: colors.border
  },
  primaryText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13
  },
  disabledText: {
    color: colors.textMuted
  }
});
