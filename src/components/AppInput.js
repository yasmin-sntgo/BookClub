import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import { EyeIcon } from "./EyeIcon";

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  autoCorrect = false
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const hasPasswordToggle = Boolean(secureTextEntry);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, focused && styles.focused]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={hasPasswordToggle && !visible}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {hasPasswordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
            hitSlop={10}
            onPress={() => setVisible((current) => !current)}
            style={styles.iconButton}
          >
            <EyeIcon hidden={!visible} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md
  },
  label: {
    ...type.label,
    color: colors.textSoft,
    marginBottom: 7,
    textTransform: "uppercase"
  },
  inputBox: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.cardSoft,
    flexDirection: "row",
    alignItems: "center"
  },
  focused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.accentWash
  },
  input: {
    ...type.input,
    flex: 1,
    minHeight: 48,
    color: colors.text,
    paddingLeft: 15,
    paddingRight: spacing.sm
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  }
});
