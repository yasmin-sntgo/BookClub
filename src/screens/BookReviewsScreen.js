import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { mockBooks, mockComments, mockReviews, mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function BookReviewsScreen({
  bookId = "dune",
  comments = mockComments,
  reviews = mockReviews,
  onBack,
  onCreate,
  onCreateReview,
  onNavigate,
  onReviewOpen,
  onUserOpen
}) {
  const book = mockBooks.find((item) => item.id === bookId) ?? mockBooks[1];
  const bookReviews = useMemo(
    () => reviews.filter((review) => review.bookId === book.id),
    [book.id, reviews]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Resenhas</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{book.title}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => onCreateReview?.(book.id)} style={styles.headerButton}>
            <Icon name="comment" color={colors.textSoft} size={22} strokeWidth={2.2} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <BookCover book={book} size="medium" />
            <View style={styles.summaryText}>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
              <View style={styles.scoreLine}>
                <Text style={styles.scoreNumber}>{book.rating}</Text>
                <RatingStars rating={book.rating} size={14} />
              </View>
              <Text style={styles.countText}>
                {bookReviews.length === 1 ? "1 resenha publicada" : `${bookReviews.length} resenhas publicadas`}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recentes</Text>
          </View>

          {bookReviews.length > 0 ? (
            <View style={styles.reviewList}>
              {bookReviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  commentCount={countReviewComments(review, comments)}
                  onReviewOpen={onReviewOpen}
                  onUserOpen={onUserOpen}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Ainda nao tem resenhas</Text>
              <Text style={styles.emptyText}>Quando alguem escrever sobre este livro, aparece aqui.</Text>
            </View>
          )}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function ReviewRow({ review, commentCount, onReviewOpen, onUserOpen }) {
  const userId = mockUsers.find((user) => user.handle === review.handle)?.id ?? "lia";

  return (
    <Pressable accessibilityRole="button" onPress={() => onReviewOpen?.(review.id)} style={styles.reviewRow}>
      <Pressable
        accessibilityRole="button"
        onPress={(event) => {
          event.stopPropagation?.();
          onUserOpen?.(userId);
        }}
        style={styles.reviewTop}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.avatar}</Text>
        </View>
        <View style={styles.userCopy}>
          <Text style={styles.userName} numberOfLines={1}>{review.user}</Text>
          <Text style={styles.userMeta} numberOfLines={1}>{review.handle} - {review.time}</Text>
        </View>
      </Pressable>
      <RatingStars rating={review.rating} size={14} />
      <Text style={styles.reviewText} numberOfLines={3}>{review.text}</Text>
      <View style={styles.reviewMeta}>
        <Text style={styles.metaText}>{review.likes} curtidas</Text>
        <Text style={styles.metaText}>{commentCount} respostas</Text>
        <Text style={styles.readMore}>abrir</Text>
      </View>
    </Pressable>
  );
}

function countReviewComments(review, comments) {
  return comments.filter((comment) => comment.reviewId === review.id).length || review.comments;
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
  summaryCard: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
  },
  summaryText: {
    flex: 1,
    justifyContent: "center"
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28
  },
  bookAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  scoreLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  scoreNumber: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32
  },
  countText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  sectionHeader: {
    marginTop: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  reviewList: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  reviewRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm
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
  userCopy: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  userMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15
  },
  reviewText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md
  },
  metaText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  readMore: {
    marginLeft: "auto",
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  emptyCard: {
    minHeight: 118,
    padding: spacing.md,
    borderRadius: 22,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  }
});
