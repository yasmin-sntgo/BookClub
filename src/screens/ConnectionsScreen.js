import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const tabs = ["Seguidores", "Seguindo"];

export function ConnectionsScreen({
  userId = "yasmin",
  initialTab = "Seguidores",
  onBack,
  onCreate,
  onNavigate,
  onUserOpen
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const user = mockUsers.find((item) => item.id === userId) ?? mockUsers[0];
  const usersById = useMemo(
    () => Object.fromEntries(mockUsers.map((item) => [item.id, item])),
    []
  );
  const ids = activeTab === "Seguidores" ? user.followerIds ?? [] : user.followingIds ?? [];
  const people = ids.map((id) => usersById[id]).filter(Boolean);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Conexoes</Text>
            <Text style={styles.subtitle}>{user.handle}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="button"
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {people.length > 0 ? (
            <View style={styles.peopleList}>
              {people.map((person) => (
                <UserRow key={person.id} user={person} onPress={() => onUserOpen?.(person.id)} />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nada por aqui</Text>
              <Text style={styles.emptyText}>
                Quando houver usuarios em {activeTab.toLowerCase()}, eles aparecem nesta lista.
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function UserRow({ user, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.userRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.avatar}</Text>
      </View>
      <View style={styles.userCopy}>
        <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.userMeta} numberOfLines={2}>{user.handle} - {user.bio}</Text>
      </View>
      <Pressable accessibilityRole="button" style={[styles.followButton, user.isFollowing && styles.followingButton]}>
        <Text style={[styles.followText, user.isFollowing && styles.followingText]}>
          {user.isFollowing ? "Seguindo" : "Seguir"}
        </Text>
      </Pressable>
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
  titleBlock: {
    alignItems: "center",
    flex: 1
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  tabs: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  tab: {
    flex: 1,
    minHeight: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeTab: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.2)"
  },
  tabText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeTabText: {
    color: colors.text
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  peopleList: {
    gap: 10
  },
  userRow: {
    minHeight: 78,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarText: {
    color: colors.textSoft,
    fontFamily: fonts.display,
    fontSize: 17
  },
  userCopy: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  userMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  followButton: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)"
  },
  followingButton: {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: colors.border
  },
  followText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 11
  },
  followingText: {
    color: colors.textSoft
  },
  empty: {
    minHeight: 148,
    borderRadius: 24,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm
  }
});
