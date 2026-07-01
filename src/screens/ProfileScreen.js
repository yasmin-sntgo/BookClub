import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { mockBooks, mockLists, mockReviews, mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const activityTabs = ["Resenhas", "Avaliacoes", "Listas"];
const moreOptions = ["Compartilhar perfil", "Denunciar usuario", "Bloquear usuario", "Silenciar usuario"];
const ownProfileOptions = ["Minhas interacoes", "Configuracoes", "Compartilhar perfil", "Sair da conta"];

function waitForSheetClose() {
  return new Promise((resolve) => setTimeout(resolve, 180));
}

export function ProfileScreen({
  userId = "lia",
  followedUserIds = [],
  initialTab = "Resenhas",
  lists = mockLists,
  onBack,
  onBookOpen,
  onCreate,
  onEditProfile,
  onInteractionsOpen,
  onConnectionsOpen,
  onListOpen,
  onNavigate,
  onReviewOpen,
  onTabChange,
  onToggleFollow,
  profileOverride,
  ratings = [],
  reviews = mockReviews
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const baseUser = mockUsers.find((item) => item.id === userId) ?? mockUsers[3];
  const user = baseUser.id === "yasmin" && profileOverride ? { ...baseUser, ...profileOverride } : baseUser;
  const isOwnProfile = user.id === "yasmin";
  const followingProfile = followedUserIds.includes(user.id);
  const booksById = useMemo(
    () => Object.fromEntries(mockBooks.map((book) => [book.id, book])),
    []
  );
  const listsById = useMemo(
    () => Object.fromEntries(lists.map((list) => [list.id, list])),
    [lists]
  );
  const userReviews = reviews.filter((review) => review.handle === user.handle);
  const userRatings = ratings.filter((rating) => rating.handle === user.handle);
  const baseUserLists = user.listIds.map((listId) => listsById[listId]).filter(Boolean);
  const localUserLists = isOwnProfile
    ? lists.filter((list) => list.local || (list.creator === "Yasmin" && !user.listIds.includes(list.id)))
    : [];
  const userLists = [...localUserLists, ...baseUserLists];
  const activities = buildActivities({ user, reviews: userReviews, ratings: userRatings, lists: userLists, booksById });
  const visibleActivities = activities.filter((activity) => activity.type === activeTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, userId]);

  function selectTab(tab) {
    setActiveTab(tab);
    onTabChange?.(tab);
  }

  async function shareProfile() {
    await waitForSheetClose();
    setNotice("Abrindo compartilhamento...");
    try {
      const result = await Share.share({
        message: `${user.name} no BookClub: ${user.handle}\nbookclub://usuarios/${user.id}`
      });

      if (result?.action === Share.dismissedAction) {
        setNotice("Compartilhamento cancelado.");
        return;
      }

      setNotice("Perfil pronto para compartilhar.");
    } catch (error) {
      setNotice(`Perfil: bookclub://usuarios/${user.id}`);
    }
  }

  async function handleProfileOption(option) {
    setMoreOpen(false);

    if (option === "Minhas interacoes") {
      onInteractionsOpen?.();
      return;
    }

    if (option === "Compartilhar perfil") {
      await shareProfile();
      return;
    }

    if (option === "Configuracoes") {
      setNotice("Configuracoes vao concentrar privacidade, conta e preferencias.");
      return;
    }

    if (option === "Sair da conta") {
      setNotice("Saida da conta vai ser ligada quando tivermos autenticacao.");
      return;
    }

    if (option === "Denunciar usuario") {
      setNotice("Denuncia registrada neste exemplo.");
      return;
    }

    if (option === "Bloquear usuario") {
      setNotice("Usuario bloqueado neste exemplo.");
      return;
    }

    if (option === "Silenciar usuario") {
      setNotice("Usuario silenciado neste exemplo.");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.title}>Perfil</Text>
          <Pressable accessibilityRole="button" onPress={() => setMoreOpen(true)} style={styles.headerButton}>
            <Icon name="more" color={colors.textSoft} size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHead}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
            </View>
            <View style={styles.identity}>
              <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.handle}>{user.handle}</Text>
              <View style={styles.socialLine}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onConnectionsOpen?.(user.id, "Seguidores")}
                  style={styles.socialPill}
                >
                  <Text style={styles.socialText}><Text style={styles.socialNumber}>{user.followers}</Text> seguidores</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onConnectionsOpen?.(user.id, "Seguindo")}
                  style={styles.socialPill}
                >
                  <Text style={styles.socialText}><Text style={styles.socialNumber}>{user.following}</Text> seguindo</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={isOwnProfile ? onEditProfile : () => onToggleFollow?.(user.id)}
              style={[styles.primaryAction, !isOwnProfile && followingProfile && styles.followingAction]}
            >
              <Text style={[styles.primaryActionText, !isOwnProfile && followingProfile && styles.followingActionText]}>
                {isOwnProfile ? "Editar perfil" : followingProfile ? "Seguindo" : "Seguir"}
              </Text>
            </Pressable>
            {!isOwnProfile ? (
              <Pressable accessibilityRole="button" style={styles.secondaryAction}>
                <Icon name="comment" color={colors.text} size={22} strokeWidth={2.2} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {activityTabs.map((tab) => (
              <Pressable
                key={tab}
                accessibilityRole="button"
                onPress={() => selectTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.activityList}>
            {visibleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onBookOpen={onBookOpen}
                onListOpen={onListOpen}
                onReviewOpen={onReviewOpen}
              />
            ))}
            {visibleActivities.length === 0 ? (
              <View style={styles.emptyActivity}>
                <Text style={styles.emptyActivityTitle}>Nada por aqui ainda</Text>
                <Text style={styles.emptyActivityText}>
                  Quando houver atividade nessa aba, ela aparece aqui.
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
        <OptionSheet
          visible={moreOpen}
          options={isOwnProfile ? ownProfileOptions : moreOptions}
          onSelect={handleProfileOption}
          onClose={() => setMoreOpen(false)}
        />
        {notice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function buildActivities({ user, reviews, ratings, lists, booksById }) {
  const reviewActivities = reviews.map((review) => ({
    id: `review-${review.id}`,
    type: "Resenhas",
    label: `${user.name.split(" ")[0]} resenhou`,
    userName: user.name,
    time: review.time,
    review,
    book: booksById[review.bookId]
  }));

  const localRatingActivities = ratings.map((rating) => ({
    id: `rating-${rating.id}`,
    type: "Avaliacoes",
    label: `${user.name.split(" ")[0]} avaliou`,
    userName: user.name,
    time: rating.time,
    rating: rating.rating,
    book: booksById[rating.bookId]
  }));

  const sampleRatingActivity = user.favoriteBookIds.slice(0, 1).map((bookId) => ({
    id: `rating-sample-${bookId}`,
    type: "Avaliacoes",
    label: `${user.name.split(" ")[0]} avaliou`,
    userName: user.name,
    time: "ontem",
    rating: 4,
    book: booksById[bookId]
  }));

  const listActivities = lists.map((list) => ({
    id: `list-${list.id}`,
    type: "Listas",
    label: `${user.name.split(" ")[0]} criou uma lista`,
    userName: user.name,
    time: "3 dias atras",
    list,
    books: list.bookIds.map((bookId) => booksById[bookId]).filter(Boolean)
  }));

  return [...reviewActivities, ...localRatingActivities, ...sampleRatingActivity, ...listActivities];
}

function SectionHeader({ title, action, compact = false, onAction }) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : action ? (
        <Text style={styles.sectionAction}>{action}</Text>
      ) : null}
    </View>
  );
}

function ActivityCard({ activity, onBookOpen, onListOpen, onReviewOpen }) {
  if (activity.type === "Resenhas") {
    return (
      <Pressable accessibilityRole="button" onPress={() => onReviewOpen?.(activity.review.id, "profile")} style={styles.activityCard}>
        <View style={styles.reviewLayout}>
          <Pressable onPress={() => onBookOpen?.(activity.book.id)} style={styles.smallCover}>
            <BookCover book={activity.book} size="small" />
          </Pressable>
          <View style={styles.activityCopy}>
            <View style={styles.simpleTopLine}>
              <Text style={styles.activityLabel}>{activity.userName}</Text>
              <RatingStars rating={activity.review.rating} size={13} />
            </View>
            <Text style={styles.activityTitle} numberOfLines={2}>{activity.book.title}</Text>
            <Text style={styles.reviewText} numberOfLines={3}>{activity.review.text}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (activity.type === "Avaliacoes") {
    return (
      <Pressable accessibilityRole="button" onPress={() => onBookOpen?.(activity.book.id)} style={styles.ratingActivityCard}>
        <View style={styles.ratingStarsBadge}>
          <RatingStars rating={activity.rating} size={13} />
        </View>
        <View style={styles.activityCopy}>
          <Text style={styles.ratingUserName} numberOfLines={1}>{activity.userName}</Text>
          <Text style={styles.activityTitle} numberOfLines={1}>{activity.book.title}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={() => onListOpen?.(activity.list.id)} style={styles.activityCard}>
      <Text style={styles.activityLabel}>{activity.label}</Text>
      <Text style={styles.activityTitle} numberOfLines={2}>{activity.list.title}</Text>
    </Pressable>
  );
}

function ActivityTop({ activity, rating }) {
  return (
    <View style={styles.activityTop}>
      <View style={styles.activityPerson}>
        <View style={styles.miniAvatar}>
          <Text style={styles.miniAvatarText}>{activity.label[0]}</Text>
        </View>
        <View style={styles.activityPersonCopy}>
          <Text style={styles.activityLabel}>{activity.label}</Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
      </View>
      {rating ? <RatingStars rating={rating} size={14} /> : null}
    </View>
  );
}

function OptionSheet({ visible, options, onClose, onSelect }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.optionSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Mais opcoes</Text>
          {options.map((option) => (
            <Pressable key={option} onPress={() => onSelect?.(option)} style={styles.optionRow}>
              <Text style={styles.optionText}>{option}</Text>
              <Icon name="chevron" color={colors.textMuted} size={20} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
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
    fontSize: 28,
    lineHeight: 32
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 120
  },
  profileHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.md
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1d1a16",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.18)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 34,
    elevation: 12
  },
  avatarText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48
  },
  identity: {
    flex: 1,
    minWidth: 0
  },
  name: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 25,
    lineHeight: 29
  },
  handle: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2
  },
  socialLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: spacing.md
  },
  socialPill: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  socialText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  socialNumber: {
    color: colors.text
  },
  bio: {
    color: "#ded5c6",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: spacing.lg
  },
  primaryAction: {
    flex: 1,
    minHeight: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text
  },
  followingAction: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border
  },
  primaryActionText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13
  },
  followingActionText: {
    color: colors.text
  },
  secondaryAction: {
    width: 48,
    minHeight: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.15)"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sectionHeaderCompact: {
    marginBottom: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  sectionAction: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  tabs: {
    gap: 8,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  tab: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeTab: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  tabText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeTabText: {
    color: colors.ink
  },
  activityList: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  activityCard: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  ratingActivityCard: {
    minHeight: 74,
    marginVertical: 8,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  ratingStarsBadge: {
    minWidth: 92,
    minHeight: 38,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(233,198,95,0.09)",
    borderWidth: 1,
    borderColor: "rgba(233,198,95,0.18)"
  },
  ratingUserName: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 3
  },
  emptyActivity: {
    minHeight: 118,
    borderRadius: 24,
    padding: spacing.md,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyActivityTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  emptyActivityText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  },
  activityTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  activityPerson: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  miniAvatar: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: "#fff1cd",
    alignItems: "center",
    justifyContent: "center"
  },
  miniAvatarText: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 15
  },
  activityPersonCopy: {
    flex: 1,
    minWidth: 0
  },
  activityLabel: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  activityTime: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 1
  },
  reviewLayout: {
    flexDirection: "row",
    gap: spacing.md
  },
  simpleTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: 4
  },
  smallCover: {
    width: 76
  },
  ratingLayout: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  ratingCover: {
    width: 58
  },
  activityCopy: {
    flex: 1,
    minWidth: 0
  },
  activityTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  reviewText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  ratingText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6
  },
  activityMeta: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.sm
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  optionSheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    maxHeight: "82%",
    padding: spacing.lg,
    borderRadius: 28,
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)"
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29,
    marginBottom: spacing.md
  },
  optionRow: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm
  },
  optionText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14
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
