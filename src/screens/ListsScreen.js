import { useRef, useState } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { mockBooks, mockLists } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const categories = ["Todos", "Classicos", "Chorar", "Ficcao cientifica", "Terror", "Fantasia", "Nacionais"];
const FEATURED_CARD_WIDTH = 304;
const FEATURED_CARD_STEP = FEATURED_CARD_WIDTH + spacing.md;

export function ListsScreen({ lists = mockLists, savedListIds = [], onBookOpen, onCreate, onListOpen, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showUserLists, setShowUserLists] = useState(false);
  const booksById = Object.fromEntries(mockBooks.map((book) => [book.id, book]));
  const publicLists = lists.filter((list) => !list.private);
  const savedLists = lists.filter((list) => savedListIds.includes(list.id));
  const userLists = lists.filter((list) => list.creator === "Yasmin");
  const exploreLists = activeCategory === "Todos"
    ? publicLists
    : publicLists.filter((list) => list.tag === activeCategory.toLowerCase());

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Listas</Text>
            <Text style={styles.subtitle}>curadorias de leitores</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SectionHeader title="Suas listas" />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowUserLists((current) => !current)}
              style={styles.personalSummaryCard}
            >
              <View style={styles.personalIcon}>
                <Icon name="list" color={colors.accent} size={24} />
              </View>
              <View style={styles.personalCopy}>
                <Text style={styles.personalTitle}>
                  {userLists.length ? `${userLists.length} lista publicada` : "Nenhuma lista ainda"}
                </Text>
                <Text style={styles.personalText}>
                  {userLists.length ? "favoritas, ideias para depois e leituras que voce recomenda." : "quando voce criar pelo +, ela aparece aqui."}
                </Text>
              </View>
              <Icon name="next" color={colors.textMuted} size={20} strokeWidth={2.1} />
            </Pressable>

            {showUserLists && userLists.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personalListsRail}>
                {userLists.map((list) => (
                  <SavedListCard
                    key={`mine-${list.id}`}
                    list={list}
                    books={list.bookIds.map((bookId) => booksById[bookId]).filter(Boolean)}
                    onBookOpen={onBookOpen}
                    onListOpen={onListOpen}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>

          <View style={styles.section}>
            <SectionHeader title="Destaques do dia" />
            <FeaturedCarousel
              lists={publicLists}
              booksById={booksById}
              onBookOpen={onBookOpen}
              onListOpen={onListOpen}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRail}>
            {categories.map((category) => (
              <Pressable
                accessibilityRole="button"
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.moodChip, activeCategory === category && styles.activeMoodChip]}
              >
                <Text style={[styles.moodText, activeCategory === category && styles.activeMoodText]}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <SectionHeader title="Salvas por voce" action="Ver todas" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedMiniRail}>
              {savedLists.map((list) => (
                <Pressable
                  accessibilityRole="button"
                  key={`saved-${list.id}`}
                  onPress={() => onListOpen?.(list.id)}
                  style={styles.savedMiniCard}
                >
                  <Text style={styles.savedMiniTitle} numberOfLines={2}>{list.title}</Text>
                  <Text style={styles.savedMiniMeta} numberOfLines={1}>{list.booksCount} livros - {list.handle}</Text>
                  <View style={styles.savedMiniFooter}>
                    <Icon name="bookmark" color={colors.accent} size={14} strokeWidth={2} />
                    <Text style={styles.savedMiniFooterText}>{list.saves} salvos</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Explore Listas" />
            {exploreLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                books={list.bookIds.map((bookId) => booksById[bookId]).filter(Boolean)}
                onBookOpen={onBookOpen}
                onListOpen={onListOpen}
              />
            ))}
            {exploreLists.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Nada nessa categoria ainda</Text>
                <Text style={styles.emptyText}>quando alguem criar uma lista daqui, ela aparece no Explore.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <BottomNav activeTab="lists" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function FeaturedCarousel({ lists, booksById, onBookOpen, onListOpen }) {
  const carouselRef = useRef(null);
  const carouselLists = lists.length > 1 ? [...lists, ...lists, ...lists] : lists;
  const middleStartIndex = lists.length;

  function handleMomentumEnd(event) {
    if (lists.length <= 1) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / FEATURED_CARD_STEP);
    const originalIndex = index % lists.length;

    if (index < lists.length) {
      carouselRef.current?.scrollToIndex({ index: middleStartIndex + originalIndex, animated: false });
    }

    if (index >= lists.length * 2) {
      carouselRef.current?.scrollToIndex({ index: middleStartIndex + originalIndex, animated: false });
    }
  }

  return (
    <FlatList
      ref={carouselRef}
      horizontal
      data={carouselLists}
      keyExtractor={(item, index) => `featured-${item.id}-${index}`}
      renderItem={({ item }) => (
        <FeaturedListCard
          list={item}
          books={item.bookIds.map((bookId) => booksById[bookId]).filter(Boolean)}
          onBookOpen={onBookOpen}
          onListOpen={onListOpen}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.featuredGap} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.featuredRail}
      initialScrollIndex={lists.length > 1 ? middleStartIndex : 0}
      getItemLayout={(_, index) => ({
        length: FEATURED_CARD_STEP,
        offset: FEATURED_CARD_STEP * index,
        index
      })}
      onMomentumScrollEnd={handleMomentumEnd}
      onScrollToIndexFailed={({ index }) => {
        requestAnimationFrame(() => {
          carouselRef.current?.scrollToIndex({ index, animated: false });
        });
      }}
      snapToInterval={FEATURED_CARD_STEP}
      decelerationRate="fast"
    />
  );
}

function FeaturedListCard({ list, books, onBookOpen, onListOpen }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onListOpen?.(list.id)} style={styles.featuredCard}>
      <View style={styles.featuredTop}>
        <Text style={styles.featuredHandle}>{list.handle}</Text>
      </View>
      <Text style={styles.heroTitle} numberOfLines={2}>{list.title}</Text>
      <Text style={styles.heroText} numberOfLines={2}>{list.description}</Text>
      <PreviewStack books={books} onBookOpen={onBookOpen} />
    </Pressable>
  );
}

function SavedListCard({ list, books, onBookOpen, onListOpen }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onListOpen?.(list.id)} style={styles.savedCard}>
      <PreviewStack books={books} onBookOpen={onBookOpen} compact />
      <Text style={styles.savedTitle} numberOfLines={2}>{list.title}</Text>
      <Text style={styles.savedMeta} numberOfLines={1}>{list.booksCount} livros - {list.handle}</Text>
    </Pressable>
  );
}

function ListCard({ list, books, onBookOpen, onListOpen }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onListOpen?.(list.id)} style={styles.listCard}>
      <View style={styles.listTop}>
        <View style={styles.listCopy}>
          <Text style={styles.listTag}>{list.tag}</Text>
          <Text style={styles.listTitle} numberOfLines={2}>{list.title}</Text>
          <Text style={styles.listMeta}>{list.booksCount} livros - {list.saves} salvos</Text>
        </View>
        <Text style={styles.creator}>{list.handle}</Text>
      </View>

      <Text style={styles.listDescription} numberOfLines={2}>{list.description}</Text>
      <PreviewStack books={books} onBookOpen={onBookOpen} compact />
    </Pressable>
  );
}

function PreviewStack({ books, onBookOpen, compact = false }) {
  const visibleBooks = books.slice(0, 3);
  const overlap = compact ? -8 : -14;

  return (
    <View style={[styles.previewStack, compact && styles.compactStack]}>
      {visibleBooks.map((book, index) => (
        <Pressable
          accessibilityRole="button"
          key={`${book.id}-${index}`}
          onPress={() => onBookOpen?.(book.id)}
          style={[styles.previewCover, { marginLeft: index === 0 ? 0 : overlap, zIndex: visibleBooks.length - index }]}
        >
          <BookCover book={book} size={compact ? "small" : "listPreview"} />
        </Pressable>
      ))}
    </View>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
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
  headerSpacer: {
    width: 42,
    height: 42
  },
  titleBlock: {
    alignItems: "center"
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: 120
  },
  hero: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)",
    backgroundColor: "rgba(255,255,255,0.045)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 28,
    elevation: 10
  },
  featuredRail: {
    paddingHorizontal: spacing.lg
  },
  featuredGap: {
    width: spacing.md
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    minHeight: 282,
    padding: spacing.lg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)",
    backgroundColor: "rgba(255,255,255,0.045)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 28,
    elevation: 10
  },
  featuredTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: spacing.sm
  },
  featuredHandle: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    maxWidth: 112,
    textAlign: "left",
    marginBottom: spacing.sm
  },
  heroKicker: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase",
    marginBottom: spacing.sm
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 29
  },
  heroText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    marginBottom: spacing.md
  },
  moodRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  moodChip: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
  },
  activeMoodChip: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.2)"
  },
  moodText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeMoodText: {
    color: colors.text
  },
  section: {
    marginBottom: spacing.xl
  },
  savedCard: {
    width: 174,
    minHeight: 184,
    borderRadius: 24,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  savedTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  savedMeta: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 5
  },
  savedMiniRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm
  },
  savedMiniCard: {
    width: 176,
    minHeight: 104,
    borderRadius: 20,
    padding: spacing.md,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.032)"
  },
  savedMiniTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16
  },
  savedMiniMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 6
  },
  savedMiniFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: spacing.sm
  },
  savedMiniFooterText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14
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
  listCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  listTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.sm
  },
  listCopy: {
    flex: 1,
    minWidth: 0
  },
  listTag: {
    ...type.label,
    color: colors.warm,
    textTransform: "uppercase",
    marginBottom: 4
  },
  listTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24
  },
  listMeta: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 5
  },
  creator: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    maxWidth: 92,
    textAlign: "right"
  },
  listDescription: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.md
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    minHeight: 92,
    borderRadius: 22,
    padding: spacing.md,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
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
    lineHeight: 16,
    marginTop: 4
  },
  previewStack: {
    minHeight: 126,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    overflow: "hidden"
  },
  compactStack: {
    minHeight: 86
  },
  previewCover: {
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6
  },
  personalListsRail: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md
  },
  personalSummaryCard: {
    marginHorizontal: spacing.lg,
    minHeight: 84,
    borderRadius: 22,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
  },
  personalIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  personalCopy: {
    flex: 1,
    minWidth: 0
  },
  personalTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  personalText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  }
});
