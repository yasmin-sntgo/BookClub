import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function EditProfileScreen({ onBack, onCreate, onNavigate, onSave, profileOverride }) {
  const baseUser = mockUsers.find((item) => item.id === "yasmin") ?? mockUsers[0];
  const user = profileOverride ? { ...baseUser, ...profileOverride } : baseUser;
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle.replace("@", ""));
  const [bio, setBio] = useState(user.bio);

  function handleSave() {
    onSave?.({
      avatar: avatar.trim().slice(0, 1).toUpperCase() || user.avatar,
      name: name.trim() || user.name,
      handle: `@${handle.replace("@", "").trim() || user.handle.replace("@", "")}`,
      bio: bio.trim()
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.title}>Editar perfil</Text>
          <Pressable accessibilityRole="button" onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Salvar</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarPreview}>
              <Text style={styles.avatarPreviewText}>{(avatar.trim()[0] || user.avatar).toUpperCase()}</Text>
            </View>
            <View style={styles.avatarCopy}>
              <Text style={styles.avatarTitle}>Avatar</Text>
              <View style={styles.avatarInputWrap}>
                <TextInput
                  value={avatar}
                  onChangeText={setAvatar}
                  maxLength={1}
                  autoCapitalize="characters"
                  placeholder="Y"
                  placeholderTextColor={colors.textMuted}
                  style={styles.avatarInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Field
              label="Nome"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
            />
            <Field
              label="Usuario"
              value={handle}
              onChangeText={(text) => setHandle(text.replace("@", ""))}
              placeholder="usuario"
              prefix="@"
              autoCapitalize="none"
            />
            <Field
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Escreva uma bio curta"
              multiline
            />
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Previa</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>{(avatar.trim()[0] || user.avatar).toUpperCase()}</Text>
              </View>
              <View style={styles.previewCopy}>
                <Text style={styles.previewName} numberOfLines={1}>{name.trim() || user.name}</Text>
                <Text style={styles.previewHandle} numberOfLines={1}>
                  @{handle.replace("@", "").trim() || user.handle.replace("@", "")}
                </Text>
              </View>
            </View>
            <Text style={styles.previewBio}>{bio.trim() || "Sem bio por enquanto."}</Text>
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function Field({ label, prefix, multiline = false, style, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.textAreaWrap]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          textAlignVertical={multiline ? "top" : "center"}
          multiline={multiline}
          style={[styles.input, multiline && styles.textArea, style]}
          {...inputProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center"
  },
  shell: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.background,
    position: "relative",
    overflow: "hidden",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border
  },
  header: {
    minHeight: 92,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(16,16,16,0.96)"
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30
  },
  saveButton: {
    minWidth: 72,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  saveText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.lg
  },
  avatarPreview: {
    width: 94,
    height: 94,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1d1a16",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.18)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 28,
    elevation: 10
  },
  avatarPreviewText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 46
  },
  avatarCopy: {
    flex: 1,
    minWidth: 0
  },
  avatarTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    marginBottom: spacing.sm
  },
  avatarInputWrap: {
    width: 74,
    minHeight: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarInput: {
    width: "100%",
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    textAlign: "center",
    paddingVertical: 0
  },
  formCard: {
    borderRadius: 26,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  field: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  label: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    marginBottom: spacing.sm
  },
  inputWrap: {
    minHeight: 48,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.08)"
  },
  textAreaWrap: {
    minHeight: 132,
    alignItems: "flex-start",
    paddingTop: spacing.md
  },
  prefix: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    marginRight: 2
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 0
  },
  textArea: {
    minHeight: 104,
    fontFamily: fonts.body,
    lineHeight: 22
  },
  previewCard: {
    marginTop: spacing.lg,
    borderRadius: 26,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  previewLabel: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  previewAvatar: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  previewAvatarText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 21
  },
  previewCopy: {
    flex: 1,
    minWidth: 0
  },
  previewName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  previewHandle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  previewBio: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.md
  }
});
