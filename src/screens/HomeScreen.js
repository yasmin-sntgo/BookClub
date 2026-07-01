import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { FeedTabs } from "../components/FeedTabs";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { mockBooks, mockComments, mockReviews, mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const reviewFilters = [
  { id: "all", label: "Todos" },
  { id: "following", label: "Seguindo" },
  { id: "popular", label: "Mais curtidas" }
];

export function HomeScreen({
  initialTab = "books",
  followedUserIds = [],
  comments = mockComments,
  likedReviewIds = [],
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
  onUserOpen,
  unreadNotificationsCount = 0
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [notice, setNotice] = useState("");
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
          <FeedTabs
            activeTab={activeTab}
            onChange={(nextTab) => {
              setActiveTab(nextTab);
              onTabChange?.(nextTab);
            }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "books" ? (
            <BooksPanel books={mockBooks} onBookOpen={onBookOpen} />
          ) : (
            <ReviewsPanel
              followedUserIds={followedUserIds}
              comments={comments}
              likedReviewIds={likedReviewIds}
              reviews={reviews}
              booksById={booksById}
              onBookOpen={onBookOpen}
              onReviewOpen={onReviewOpen}
              onShareReview={() => setNotice("Resenha pronta para compartilhar.")}
              onToggleReviewLike={onToggleReviewLike}
              onUserOpen={onUserOpen}
            />
          )}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
        {notice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
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
        books={expandedRails.includes("Popular agora") ? books : books.slice(0, 4)}
        onAction={() => toggleRail("Popular agora")}
        onBookOpen={onBookOpen}
      />
      <BookRail
        title="Novos no clube"
        action={expandedRails.includes("Novos no clube") ? null : "Ver todos"}
        books={expandedRails.includes("Novos no clube") ? [...books].reverse() : [...books].reverse().slice(0, 4)}
        onAction={() => toggleRail("Novos no clube")}
        onBookOpen={onBookOpen}
      />
      <BookRail
        title="Mais comentados"
        action={expandedRails.includes("Mais comentados") ? null : "Ver todos"}
        books={expandedRails.includes("Mais comentados") ? [books[1], books[3], books[0], books[4], books[2], books[5]] : [books[1], books[3], books[0], books[4]]}
        onAction={() => toggleRail("Mais comentados")}
        onBookOpen={onBookOpen}
      />
      <BookGrid title="Explore livros" books={[...books, ...books].map((book, index) => ({
        ...book,
        gridId: `${book.id}-${index}`
      }))} onBookOpen={onBookOpen} />
    </View>
  );
}

function BookRail({ title, action, books, onAction, onBookOpen }) {
  return (
    <View style={styles.railSection}>
      <SectionHeader title={title} action={action} onAction={onAction} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookRail}
      >
        {books.map((book) => (
            <Pressable key={`${title}-${book.id}`} onPress={() => onBookOpen?.(book.id, "books")} style={styles.bookItem}>
            <BookCover book={book} size="medium" />
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
  reviews,
  booksById,
  onBookOpen,
  onReviewOpen,
  onShareReview,
  onToggleReviewLike,
  onToggleReviewSave,
  onUserOpen
}) {
  const [filterMode, setFilterMode] = useState("all");
  const followedHandles = mockUsers
    .filter((user) => followedUserIds.includes(user.id))
    .map((user) => user.handle);
  const visibleReviews = useMemo(() => {
    if (filterMode === "following") {
      return reviews.filter((review) => followedHandles.includes(review.handle));
    }

    if (filterMode === "popular") {
      return [...reviews].sort((first, second) => second.likes - first.likes);
    }

    return reviews;
  }, [filterMode, followedHandles, reviews]);
  const selectedFilter = reviewFilters.find((filter) => filter.id === filterMode) ?? reviewFilters[0];

  return (
    <View style={styles.reviews}>
      <SectionHeader
        title={filterMode === "all" ? "Resenhas recentes" : selectedFilter.label}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
        {reviewFilters.map((filter) => (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            onPress={() => setFilterMode(filter.id)}
            style={[styles.filterChip, filterMode === filter.id && styles.activeFilterChip]}
          >
            <Text style={[styles.filterChipText, filterMode === filter.id && styles.activeFilterChipText]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {visibleReviews.map((review) => (
        <ReviewPost
          key={review.id}
          review={review}
          book={booksById[review.bookId]}
          liked={likedReviewIds.includes(review.id)}
          saved={savedReviewIds.includes(review.id)}
          commentCount={countReviewComments(review, comments)}
          onBookOpen={onBookOpen}
          onReviewOpen={onReviewOpen}
          onShareReview={onShareReview}
          onToggleLike={() => onToggleReviewLike?.(review.id)}
          onToggleSave={() => onToggleReviewSave?.(review.id)}
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

function ReviewPost({ review, book, liked, saved, commentCount, onBookOpen, onReviewOpen, onShareReview, onToggleLike, onToggleSave, onUserOpen }) {
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
          <Text style={styles.reviewHandle}>{review.handle} · {review.time}</Text>
        </View>
        </Pressable>
      </View>

      <Pressable onPress={() => onBookOpen?.(book.id, "reviews")} style={styles.reviewBook}>
        <BookCover book={book} size="tiny" />
        <View style={styles.reviewBookInfo}>
          <Text style={styles.reviewBookTitle} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.reviewBookAuthor} numberOfLines={1}>{book.author}</Text>
          <RatingStars rating={review.rating} size={13} />
        </View>
      </Pressable>

      <Text style={styles.reviewText} numberOfLines={3}>{review.text}</Text>

      <View style={styles.reviewActions}>
        <ActionIcon
          icon="heart"
          count={likeCount}
          active={liked}
          activeColor="#d96060"
          onPress={onToggleLike}
        />
        <ActionIcon icon="comment" count={commentCount} />
        <ActionIcon
          icon="bookmark"
          count=""
          active={saved}
          activeColor={colors.accent}
          onPress={onToggleSave}
        />
        <View style={styles.actionSpacer} />
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation?.();
            onShareReview?.();
          }}
        >
          <Text style={styles.shareText}>compartilhar</Text>
        </Pressable>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background
  },
  content: {
    paddingTop: spacing.md,
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
    paddingHorizontal: 14
  },
  filterChips: {
    gap: 8,
    paddingBottom: spacing.md
  },
  filterChip: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeFilterChip: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.24)"
  },
  filterChipText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16
  },
  activeFilterChipText: {
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
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.045)",
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 5
  },
  reviewTop: {
    marginBottom: 10
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
    gap: 10,
    padding: 9,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.09)",
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2
  },
  reviewBookInfo: {
    flex: 1,
    minWidth: 0
  },
  reviewBookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 17
  },
  reviewBookAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 5
  },
  reviewText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10
  },
  reviewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg
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
  shareText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  noticeToast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 96,
    minHeight: 44,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(22,22,22,0.96)",
    borderWidth: 1,
    borderColor: colors.border
  },
  noticeText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center"
  }
});
