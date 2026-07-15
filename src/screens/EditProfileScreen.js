import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const bioLimit = 140;
const mockUsers = getUsers();

export function EditProfileScreen({ onBack, onCreate, onNavigate, onSave, profileOverride }) {
  const baseUser = mockUsers.find((item) => item.id === "yasmin") ?? mockUsers[0];
  const user = profileOverride ? { ...baseUser, ...profileOverride } : baseUser;
  const [avatar, setAvatar] = useState((user.avatar || "Y").slice(0, 1).toUpperCase());
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle.replace("@", ""));
  const [bio, setBio] = useState(user.bio);

  const cleanedHandle = sanitizeHandle(handle);
  const previewName = name.trim() || user.name;
  const previewHandle = cleanedHandle || user.handle.replace("@", "");
  const previewBio = bio.trim() || "Leituras, resenhas e listas no BookClub.";

  useEffect(() => {
    setAvatar((user.avatar || "").slice(0, 1).toUpperCase());
    setName(user.name);
    setHandle(user.handle.replace("@", ""));
    setBio(user.bio);
  }, [user.avatar, user.bio, user.handle, user.name]);

  function handleSave() {
    onSave?.({
      avatar: avatar.trim().slice(0, 1).toUpperCase() || user.avatar,
      name: previewName,
      handle: `@${previewHandle}`,
      bio: bio.trim()
    });
  }

  function updateAvatar(text) {
    setAvatar(text.trim().slice(0, 1).toUpperCase());
  }

  function updateHandle(text) {
    setHandle(sanitizeHandle(text));
  }

  function updateBio(text) {
    setBio(text.slice(0, bioLimit));
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
          <View style={styles.identityBlock}>
            <View style={styles.avatarPreview}>
              <Text style={styles.avatarPreviewText}>{avatar}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.identityTitle}>Avatar</Text>
              <View style={styles.avatarInputWrap}>
                <Text style={styles.avatarInputLabel}>Caractere</Text>
                <TextInput
                  value={avatar}
                  onChangeText={updateAvatar}
                  maxLength={1}
                  autoCapitalize="characters"
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
              maxLength={36}
            />
            <Field
              label="Usuário"
              value={handle}
              onChangeText={updateHandle}
              placeholder="usuário"
              prefix="@"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={24}
              helper="Use letras, numeros, ponto ou underline."
            />
            <Field
              label="Bio"
              value={bio}
              onChangeText={updateBio}
              placeholder="Escreva uma bio curta"
              multiline
              helper={`${bio.length}/${bioLimit}`}
            />
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Previa</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>{avatar}</Text>
              </View>
              <View style={styles.previewCopy}>
                <Text style={styles.previewName} numberOfLines={1}>{previewName}</Text>
                <Text style={styles.previewHandle} numberOfLines={1}>@{previewHandle}</Text>
              </View>
            </View>
            <Text style={styles.previewBio}>{previewBio}</Text>
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function sanitizeHandle(value) {
  return value
    .replace("@", "")
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 24);
}

function Field({ label, prefix, helper, multiline = false, style, ...inputProps }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      </View>
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
  identityBlock: {
    minHeight: 118,
    borderRadius: 28,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm
  },
  avatarPreview: {
    width: 92,
    height: 92,
    borderRadius: 34,
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
  identityCopy: {
    flex: 1,
    minWidth: 0
  },
  identityTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27
  },
  avatarInputWrap: {
    alignSelf: "flex-start",
    minHeight: 42,
    borderRadius: 17,
    paddingLeft: spacing.sm,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarInputLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    marginRight: spacing.sm
  },
  avatarInput: {
    width: 42,
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24,
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
  fieldHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm
  },
  label: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  helper: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "right",
    flexShrink: 1
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
    minHeight: 120,
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
    minHeight: 92,
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
