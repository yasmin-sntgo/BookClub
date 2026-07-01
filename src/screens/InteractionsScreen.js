import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { mockBooks, mockComments, mockLists, mockReviews } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const tabs = ["Curtidas", "Comentarios", "Salvos"];
const currentUserHandle = "@yasmin_le";

export function InteractionsScreen({
  likedCommentIds = [],
  likedReviewIds = [],
  lists = mockLists,
  reviews = mockReviews,
  savedListIds = [],
  savedReviewIds = [],
  onBack,
  onBookOpen,
  onCreate,
  onListOpen,
  onNavigate,
  onReviewOpen
}) {
  const [activeTab, setActiveTab] = useState("Curtidas");
  const booksById = useMemo(
    () => Object.fromEntries(mockBooks.map((book) => [book.id, book])),
    []
  );
  const reviewsById = useMemo(
    () => Object.fromEntries(reviews.map((review) => [review.id, review])),
    [reviews]
  );
  const listsById = useMemo(
    () => Object.fromEntries(lists.map((list) => [list.id, list])),
    [lists]
  );
  const likedReviews = reviews.filter((review) => likedReviewIds.includes(review.id));
  const likedComments = mockComments.filter((comment) => likedCommentIds.includes(comment.id));
  const likedItems = [
    ...likedReviews.map((review) => ({
      id: `review-${review.id}`,
      kind: "Resenha",
      title: booksById[review.bookId]?.title,
      book: booksById[review.bookId],
      meta: review.user,
      text: review.text,
      showCover: true,
      onOpen: () => onReviewOpen?.(review.id, "reviews")
    })),
    ...likedComments.map((comment) => {
      const review = reviewsById[comment.reviewId];

      return {
        id: `comment-${comment.id}`,
        kind: "Comentario",
        title: review ? booksById[review.bookId]?.title : "Comentario",
        book: review ? booksById[review.bookId] : null,
        meta: comment.user,
        text: comment.text,
        showCover: false,
        onOpen: () => review && onReviewOpen?.(review.id, "reviews")
      };
    })
  ].filter((item) => item.book);
  const userComments = mockComments.filter((comment) => comment.handle === currentUserHandle);
  const savedReviews = reviews.filter((review) => savedReviewIds.includes(review.id));
  const savedLists = lists.filter((list) => savedListIds.includes(list.id));
  const savedItems = [
    ...savedReviews.map((review) => ({
      id: `saved-review-${review.id}`,
      kind: "Resenha",
      title: booksById[review.bookId]?.title,
      book: booksById[review.bookId],
      meta: review.user,
      text: review.text,
      showCover: true,
      onOpen: () => onReviewOpen?.(review.id, "reviews")
    })),
    ...savedLists.map((list) => ({
      id: `saved-list-${list.id}`,
      kind: "Lista",
      title: list.title,
      meta: `${list.booksCount} livros - ${list.handle}`,
      text: list.description,
      showCover: false,
      onOpen: () => onListOpen?.(list.id)
    }))
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.title}>Interacoes</Text>
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
          {activeTab === "Curtidas" ? (
            <View style={styles.list}>
              {likedItems.map((item) => (
                <InteractionRow
                  key={item.id}
                  kind={item.kind}
                  title={item.title}
                  book={item.book}
                  meta={item.meta}
                  text={item.text}
                  showCover={item.showCover}
                  onBookOpen={onBookOpen}
                  onOpen={item.onOpen}
                />
              ))}
              {likedItems.length === 0 ? <EmptyState text="Quando voce curtir resenhas ou comentarios, eles aparecem aqui." /> : null}
            </View>
          ) : null}

          {activeTab === "Comentarios" ? (
            <View style={styles.list}>
              {userComments.map((comment) => {
                const review = reviewsById[comment.reviewId];
                const book = review ? booksById[review.bookId] : null;

                return (
                  <InteractionRow
                    key={comment.id}
                    kind="Comentario"
                    book={book}
                    title={book?.title}
                    meta={review ? `em resenha de ${review.user}` : comment.time}
                    text={comment.text}
                    showCover={false}
                    onBookOpen={onBookOpen}
                    onOpen={() => review && onReviewOpen?.(review.id, "reviews")}
                  />
                );
              })}
              {userComments.length === 0 ? <EmptyState text="Quando voce comentar em resenhas, seus comentarios aparecem aqui." /> : null}
            </View>
          ) : null}

          {activeTab === "Salvos" ? (
            <View style={styles.list}>
              {savedItems.map((item) => (
                <InteractionRow
                  key={item.id}
                  kind={item.kind}
                  title={item.title}
                  book={item.book}
                  meta={item.meta}
                  text={item.text}
                  showCover={item.showCover}
                  onBookOpen={onBookOpen}
                  onOpen={item.onOpen}
                />
              ))}
              {savedItems.length === 0 ? <EmptyState text="Listas e resenhas salvas aparecem aqui." /> : null}
            </View>
          ) : null}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function InteractionRow({ kind, title, book, meta, text, showCover = false, onBookOpen, onOpen }) {
  if (!title) {
    return null;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onOpen} style={styles.row}>
      {showCover && book ? (
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation?.();
            onBookOpen?.(book.id);
          }}
          style={styles.coverWrap}
        >
          <BookCover book={book} size="tiny" />
        </Pressable>
      ) : null}
      <View style={styles.rowCopy}>
        <Text style={styles.actionText} numberOfLines={1}>{kind}</Text>
        <Text style={styles.bookTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.metaText} numberOfLines={1}>{meta}</Text>
        <Text style={styles.previewText} numberOfLines={2}>{text}</Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ text }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
      <Text style={styles.emptyText}>{text}</Text>
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
  headerSpacer: {
    width: 42,
    height: 42
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32
  },
  tabs: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  tab: {
    flex: 1,
    minHeight: 34,
    borderRadius: 13,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 112
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  row: {
    minHeight: 82,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  coverWrap: {
    width: 46
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center"
  },
  actionText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  metaText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 17,
    marginTop: 3
  },
  previewText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  empty: {
    minHeight: 132,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: "center"
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
