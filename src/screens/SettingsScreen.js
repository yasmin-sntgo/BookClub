import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppToast } from "../components/AppToast";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function SettingsScreen({
  notificationPreferences = { social: true, books: true },
  onBack,
  onCreate,
  onNavigate,
  onNotificationPreferenceChange,
  onShelfPrivacyChange,
  shelfPrivate = false
}) {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timeout);
  }, [notice]);

  function toggleShelfPrivacy() {
    const nextValue = !shelfPrivate;
    onShelfPrivacyChange?.(nextValue);
    setNotice(nextValue ? "Sua estante agora está privada." : "Sua estante agora está pública.");
  }

  function toggleNotificationPreference(preferenceId, label) {
    const nextValue = !notificationPreferences[preferenceId];
    onNotificationPreferenceChange?.(preferenceId);
    setNotice(`${label} ${nextValue ? "ativadas" : "desativadas"}.`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.title}>Configurações</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacidade</Text>
            <SettingRow
              title="Estante privada"
              description="Quando estiver ativa, o botão de estante no seu perfil não mostra seus livros para outras pessoas."
              active={shelfPrivate}
              onPress={toggleShelfPrivacy}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notificações</Text>
            <SettingRow
              title="Atividade social"
              description="Curtidas, comentários, respostas e novos seguidores."
              active={notificationPreferences.social}
              onPress={() => toggleNotificationPreference("social", "Notificações sociais")}
            />
            <SettingRow
              title="Listas e livros"
              description="Avisos sobre listas salvas e novidades em livros marcados."
              active={notificationPreferences.books}
              onPress={() => toggleNotificationPreference("books", "Notificações de listas e livros")}
            />
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
        <AppToast message={notice} />
      </View>
    </SafeAreaView>
  );
}

function SettingRow({ title, description, active, onPress }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: active }} onPress={onPress} style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <View style={[styles.toggle, active && styles.toggleActive]}>
        <View style={[styles.toggleThumb, active && styles.toggleThumbActive]} />
      </View>
    </Pressable>
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
  headerSpacer: {
    width: 42,
    height: 42
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    gap: spacing.xl
  },
  section: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    marginBottom: spacing.xs
  },
  row: {
    minHeight: 78,
    borderRadius: 22,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border
  },
  rowCopy: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  rowDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: colors.border
  },
  toggleActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textMuted
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
    backgroundColor: colors.ink
  },
  noticeToast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 104,
    minHeight: 52,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(29,29,29,0.98)",
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.34)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 14
  },
  noticeText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  }
});
