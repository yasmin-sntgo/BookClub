import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { FeedTabs } from "../components/FeedTabs";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { SpoilerText } from "../components/SpoilerText";
import { getBooks, getComments, getReviews, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const reviewFilters = [
  { id: "all", label: "Pra voce" },
  { id: "following", label: "Seguindo" }
];
const mockBooks = getBooks();
const mockComments = getComments();
const mockReviews = getReviews();
const mockUsers = getUsers();

export function HomeScreen({
  initialTab = "books",
  followedUserIds = [],
  comments = mockComments,
  likedReviewIds = [],
  revealedSpoilerReviewIds = [],
  reviews = mockReviews,
  savedReviewIds = [],
  onBookOpen,
  onCreate,
  onNavigate,
  onNotificationsOpen,
  onReviewOpen,
  onTabChange,
  onToggleReviewLike,
  onToggleReviewSave,
  onSpoilerReveal,
  onUserOpen,
  unreadNotificationsCount = 0
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [reviewFilterMode, setReviewFilterMode] = useState("all");
  const booksById = useMemo(
    () => Object.fromEntries(mockBooks.map((book) => [book.id, book])),
    []
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <Header
          onNotificationsOpen={onNotificationsOpen}
          onUserOpen={onUserOpen}
          unreadNotificationsCount={unreadNotificationsCount}
        />
        <View style={styles.tabsWrap}>
          <View style={styles.feedControlRow}>
            <FeedTabs
              activeTab={activeTab}
              onChange={(nextTab) => {
                setActiveTab(nextTab);
                onTabChange?.(nextTab);
              }}
            />
            {activeTab === "reviews" ? (
              <ReviewFilterTabs filterMode={reviewFilterMode} onChange={setReviewFilterMode} />
            ) : null}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "books" ? (
            <BooksPanel books={mockBooks} onBookOpen={onBookOpen} />
          ) : (
            <ReviewsPanel
              followedUserIds={followedUserIds}
              comments={comments}
              likedReviewIds={likedReviewIds}
              revealedSpoilerReviewIds={revealedSpoilerReviewIds}
              reviewFilterMode={reviewFilterMode}
              reviews={reviews}
              savedReviewIds={savedReviewIds}
              booksById={booksById}
              onBookOpen={onBookOpen}
              onReviewOpen={onReviewOpen}
              onToggleReviewLike={onToggleReviewLike}
              onToggleReviewSave={onToggleReviewSave}
              onSpoilerReveal={onSpoilerReveal}
              onUserOpen={onUserOpen}
            />
          )}
        </ScrollView>
        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function Header({ onNotificationsOpen, onUserOpen, unreadNotificationsCount }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={() => onUserOpen?.("yasmin")} style={styles.headerButton}>
        <Icon name="user" color={colors.textSoft} size={21} />
      </Pressable>
      <View style={styles.logoBlock}>
        <Text style={styles.logo}>
          B<Text style={styles.logoMark}>oo</Text>kClub
        </Text>
        <Text style={styles.tagline}>leituras que puxam conversa</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => onNotificationsOpen?.()} style={styles.headerButton}>
        <Icon name="bell" color={colors.textSoft} size={21} />
        {unreadNotificationsCount > 0 ? <View style={styles.notificationDot} /> : null}
      </Pressable>
    </View>
  );
}

function BooksPanel({ books, onBookOpen }) {
  const [expandedRails, setExpandedRails] = useState([]);

  function toggleRail(title) {
    setExpandedRails((current) =>
      current.includes(title) ? current : [...current, title]
    );
  }

  return (
    <View>
      <BookRail
        title="Popular agora"
        action={expandedRails.includes("Popular agora") ? null : "Ver todos"}
        books={expandedRails.includes("Popular agora") ? books : books.slice(0, 5)}
        featured
        onAction={() => toggleRail("Popular agora")}
        onBookOpen={onBookOpen}
      />
      <BookRail
        title="Novos no clube"
        action={expandedRails.includes("Novos no clube") ? null : "Ver todos"}
        books={expandedRails.includes("Novos no clube") ? [...books].reverse() : [...books].reverse().slice(0, 6)}
        compact
        onAction={() => toggleRail("Novos no clube")}
        onBookOpen={onBookOpen}
      />
      <BookGrid title="Explore livros" books={[...books, ...books].map((book, index) => ({
        ...book,
        gridId: `${book.id}-${index}`
      }))} onBookOpen={onBookOpen} />
    </View>
  );
}

function BookRail({ title, action, books, compact = false, featured = false, onAction, onBookOpen }) {
  return (
    <View style={styles.railSection}>
      <SectionHeader title={title} action={action} onAction={onAction} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookRail}
      >
        {books.map((book) => (
          <Pressable
            key={`${title}-${book.id}`}
            onPress={() => onBookOpen?.(book.id, "books")}
            style={[styles.bookItem, compact && styles.compactBookItem, featured && styles.featuredBookItem]}
          >
            <BookCover book={book} size={compact ? "small" : "medium"} />
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function BookGrid({ title, books, onBookOpen }) {
  return (
    <View style={styles.gridSection}>
      <SectionHeader title={title} />
      <View style={styles.bookGrid}>
        {books.map((book) => (
          <Pressable
            key={book.gridId}
            onPress={() => onBookOpen?.(book.id, "books")}
            style={[styles.bookItem, styles.gridBookItem]}
          >
            <BookCover book={book} size="grid" />
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ReviewsPanel({
  followedUserIds,
  comments,
  likedReviewIds,
  revealedSpoilerReviewIds,
  reviewFilterMode = "all",
  reviews,
  savedReviewIds,
  booksById,
  onBookOpen,
  onReviewOpen,
  onToggleReviewLike,
  onToggleReviewSave,
  onSpoilerReveal,
  onUserOpen
}) {
  const followedHandles = mockUsers
    .filter((user) => followedUserIds.includes(user.id))
    .map((user) => user.handle);
  const visibleReviews = useMemo(() => {
    if (reviewFilterMode === "following") {
      return reviews.filter((review) => followedHandles.includes(review.handle));
    }

    return reviews;
  }, [reviewFilterMode, followedHandles, reviews]);

  return (
    <View style={styles.reviews}>
      {visibleReviews.map((review) => (
        <ReviewPost
          key={review.id}
          review={review}
          book={booksById[review.bookId]}
          liked={likedReviewIds.includes(review.id)}
          spoilerRevealed={revealedSpoilerReviewIds.includes(review.id)}
          saved={savedReviewIds.includes(review.id)}
          commentCount={countReviewComments(review, comments)}
          onBookOpen={onBookOpen}
          onReviewOpen={onReviewOpen}
          onToggleLike={() => onToggleReviewLike?.(review.id)}
          onToggleSave={() => onToggleReviewSave?.(review.id)}
          onSpoilerReveal={() => onSpoilerReveal?.(review.id)}
          onUserOpen={onUserOpen}
        />
      ))}
      {visibleReviews.length === 0 ? (
        <View style={styles.emptyFilter}>
          <Text style={styles.emptyFilterTitle}>Sem resenhas por aqui</Text>
          <Text style={styles.emptyFilterText}>Quando houver resenhas nesse filtro, elas aparecem aqui.</Text>
        </View>
      ) : null}
    </View>
  );
}

function ReviewFilterTabs({ filterMode = "all", onChange }) {
  return (
    <View style={styles.reviewFilterTabs}>
      {reviewFilters.map((filter) => {
        const active = filterMode === filter.id;

        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            onPress={() => onChange?.(filter.id)}
            style={[styles.reviewFilterTab, active && styles.activeReviewFilterTab]}
          >
            <Text style={[styles.reviewFilterText, active && styles.activeReviewFilterText]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ReviewPost({ review, book, liked, saved, spoilerRevealed, commentCount, onBookOpen, onReviewOpen, onSpoilerReveal, onToggleLike, onToggleSave, onUserOpen }) {
  const userId = findUserId(review.handle);
  const likeCount = review.likes + (liked && !review.liked ? 1 : 0) - (!liked && review.liked ? 1 : 0);

  return (
    <Pressable onPress={() => onReviewOpen?.(review.id, "reviews")} style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation?.();
            onUserOpen?.(userId);
          }}
          style={styles.reviewProfile}
        >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.avatar}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <Text style={styles.reviewHandle}>{review.handle} - {review.time}</Text>
        </View>
        </Pressable>
      </View>

      <Pressable
        onPress={(event) => {
          event.stopPropagation?.();
          onBookOpen?.(book.id, "reviews");
        }}
        style={styles.reviewBook}
      >
        <BookCover book={book} size="tiny" />
        <View style={styles.reviewBookInfo}>
          <Text style={styles.reviewBookTitle} numberOfLines={1}>{book.title}</Text>
          <View style={styles.reviewBookMeta}>
            <Text style={styles.reviewBookAuthor} numberOfLines={1}>{book.author}</Text>
            <RatingStars rating={review.rating} size={12} />
          </View>
        </View>
      </Pressable>

      <SpoilerText
        hasSpoiler={review.hasSpoiler}
        onReveal={onSpoilerReveal}
        revealed={spoilerRevealed}
        text={review.text}
        style={styles.reviewText}
        numberOfLines={3}
      />

      <View style={styles.reviewActions}>
        <ActionIcon
          icon="heart"
          count={likeCount}
          active={liked}
          activeColor="#d96060"
          onPress={onToggleLike}
        />
        <ActionIcon icon="comment" count={commentCount} />
        <View style={styles.actionSpacer} />
        <IconAction
          icon="bookmark"
          active={saved}
          activeColor={colors.accent}
          onPress={onToggleSave}
        />
      </View>
    </Pressable>
  );
}

function countReviewComments(review, comments) {
  return comments.filter((comment) => comment.reviewId === review.id).length || review.comments;
}

function findUserId(handle) {
  return mockUsers.find((user) => user.handle === handle)?.id ?? "lia";
}

function ActionIcon({ icon, count, active = false, activeColor = colors.accent, onPress }) {
  const color = active ? activeColor : colors.textMuted;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={(event) => {
        event.stopPropagation?.();
        onPress?.();
      }}
      style={styles.action}
    >
      <Icon
        name={icon}
        color={color}
        size={17}
        fill={active && (icon === "heart" || icon === "bookmark") ? activeColor : "none"}
      />
      <Text style={[styles.actionText, active && { color }]}>{count}</Text>
    </Pressable>
  );
}

function IconAction({ icon, active = false, activeColor = colors.accent, onPress }) {
  const color = active ? activeColor : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={(event) => {
        event.stopPropagation?.();
        onPress?.();
      }}
      style={styles.secondaryAction}
    >
      <Icon
        name={icon}
        color={color}
        size={16}
        fill={active && icon === "bookmark" ? activeColor : "none"}
        strokeWidth={2}
      />
    </Pressable>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.025)",
    position: "relative"
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent
  },
  logoBlock: {
    alignItems: "center"
  },
  logo: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  logoMark: {
    color: colors.accent
  },
  tagline: {
    color: colors.textMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  tabsWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.background
  },
  feedControlRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 120
  },
  railSection: {
    marginBottom: spacing.xl
  },
  gridSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.md
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
  bookRail: {
    paddingHorizontal: spacing.lg,
    gap: 12
  },
  bookGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18
  },
  bookItem: {
    width: 112
  },
  featuredBookItem: {
    width: 124
  },
  compactBookItem: {
    width: 74
  },
  gridBookItem: {
    width: "31%"
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 15,
    marginTop: 9
  },
  bookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  reviews: {
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  reviewFilterTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 3,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.08)"
  },
  reviewFilterTab: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  activeReviewFilterTab: {
    backgroundColor: "rgba(157,192,216,0.14)"
  },
  reviewFilterText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13
  },
  activeReviewFilterText: {
    color: colors.text
  },
  emptyFilter: {
    minHeight: 118,
    borderRadius: 24,
    padding: spacing.md,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyFilterTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  emptyFilterText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  },
  reviewCard: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240,236,228,0.075)"
  },
  reviewTop: {
    marginBottom: 9
  },
  reviewProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    alignSelf: "flex-start"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.textSoft,
    fontFamily: fonts.display,
    fontSize: 13
  },
  userInfo: {
    flexShrink: 1,
    maxWidth: "82%"
  },
  reviewUser: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16
  },
  reviewHandle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  reviewBook: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 6,
    marginBottom: 11,
    opacity: 0.94
  },
  reviewBookInfo: {
    flex: 1,
    minWidth: 0
  },
  reviewBookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16
  },
  reviewBookMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3
  },
  reviewBookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    maxWidth: 150
  },
  reviewText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12
  },
  reviewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  actionText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  actionSpacer: {
    flex: 1
  },
  secondaryAction: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
});
