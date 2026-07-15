import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { getBooks, getReviews, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const mockBooks = getBooks();
const mockReviews = getReviews();
const mockUsers = getUsers();

export function BookRatingsScreen({
  bookId = "dune",
  ratings = [],
  reviews = mockReviews,
  onBack,
  onCreate,
  onNavigate,
  onRateBook
}) {
  const book = mockBooks.find((item) => item.id === bookId) ?? mockBooks[1];

  const ratingRows = useMemo(() => {
    const localRatings = ratings
      .filter((rating) => rating.bookId === book.id)
      .map((rating) => ({
        ...rating,
        id: rating.id ?? `local-${rating.handle}`,
        source: "nota",
        detail: "avaliou sem escrever resenha"
      }));

    const reviewRatings = reviews
      .filter((review) => review.bookId === book.id)
      .map((review) => ({
        id: `review-rating-${review.id}`,
        user: review.user,
        handle: review.handle,
        avatar: review.avatar,
        time: review.time,
        reviewId: review.id,
        rating: review.rating,
        source: "resenha",
        detail: "também escreveu uma resenha"
      }));

    const usedHandles = new Set([...localRatings, ...reviewRatings].map((rating) => rating.handle));
    const sampleRatings = mockUsers
      .filter((user) => !usedHandles.has(user.handle))
      .slice(0, 3)
      .map((user, index) => ({
        id: `sample-rating-${book.id}-${user.id}`,
        user: user.name,
        handle: user.handle,
        avatar: user.avatar,
        time: ["1 d", "3 d", "1 sem"][index] ?? "agora",
        rating: Math.max(3, Math.min(5, Math.round(book.rating - (index === 1 ? 1 : 0)))),
        source: "nota",
        detail: "avaliou sem escrever resenha"
      }));

    return [...localRatings, ...reviewRatings, ...sampleRatings];
  }, [book.id, book.rating, ratings, reviews]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Avaliações</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{book.title}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => onRateBook?.(book.id)} style={styles.headerButton}>
            <Icon name="starOutline" color={colors.textSoft} size={22} strokeWidth={2.2} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.ratingsList}>
            {ratingRows.map((rating) => (
              <RatingRow
                key={rating.id}
                rating={rating}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function RatingRow({ rating }) {
  return (
    <View style={styles.ratingRowCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{rating.avatar}</Text>
      </View>
      <View style={styles.ratingContent}>
        <Text style={styles.userName} numberOfLines={1}>{rating.user}</Text>
        <RatingStars rating={rating.rating} size={14} />
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
  titleBlock: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.sm
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
  content: {
    padding: spacing.lg,
    paddingBottom: 112,
    gap: spacing.md
  },
  ratingsList: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  ratingRowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(157,192,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.14)"
  },
  avatarText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 15
  },
  ratingContent: {
    flex: 1,
    gap: 5,
    minWidth: 0
  },
  userCopy: {
    flex: 1
  },
  userName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  userMeta: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16
  },
  sourceTag: {
    color: colors.accentStrong,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(157,192,216,0.09)",
    overflow: "hidden"
  },
  ratingDetail: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  }
});
