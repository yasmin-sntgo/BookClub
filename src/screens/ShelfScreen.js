import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { getBooks } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const filters = ["Todos", "Lendo", "Quero ler", "Lidos", "Favoritos", "Abandonados"];
const mockBooks = getBooks();

export function ShelfScreen({
  initialFilter = "Todos",
  shelfEntries = [],
  onAddToShelf,
  onBookOpen,
  onCreate,
  onFilterChange,
  onNavigate
}) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const booksById = useMemo(
    () => mockBooks.reduce((books, book) => ({ ...books, [book.id]: book }), {}),
    []
  );
  const shelfBooks = useMemo(() => {
    const entriesWithBooks = shelfEntries
      .map((entry) => ({ ...entry, book: booksById[entry.bookId] }))
      .filter((entry) => entry.book);

    return {
      favorites: entriesWithBooks.filter((entry) => entry.favorite).map((entry) => entry.book),
      reading: entriesWithBooks.filter((entry) => entry.status === "reading").map((entry) => entry.book),
      want: entriesWithBooks.filter((entry) => entry.status === "want").map((entry) => entry.book),
      read: entriesWithBooks.filter((entry) => entry.status === "read").map((entry) => entry.book),
      abandoned: entriesWithBooks.filter((entry) => entry.status === "abandoned").map((entry) => entry.book)
    };
  }, [booksById, shelfEntries]);
  const shelfStats = useMemo(
    () => [
      { label: "lendo", value: shelfBooks.reading.length },
      { label: "quero ler", value: shelfBooks.want.length },
      { label: "lidos", value: shelfBooks.read.length },
      { label: "favoritos", value: shelfBooks.favorites.length }
    ],
    [shelfBooks]
  );
  const visibleSections = useMemo(
    () => getVisibleSections(activeFilter, shelfBooks),
    [activeFilter, shelfBooks]
  );
  const hasBooks = Object.values(shelfBooks).some((books) => books.length > 0);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  function selectFilter(filter) {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Estante</Text>
            <Text style={styles.subtitle}>sua biblioteca pessoal</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {hasBooks ? (
            <>
              <View style={styles.statsGrid}>
                {shelfStats.map((stat) => (
                  <View key={stat.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {filters.map((filter) => (
                  <Pressable
                    key={filter}
                    onPress={() => selectFilter(filter)}
                    style={[styles.filterChip, activeFilter === filter && styles.activeChip]}
                  >
                    <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {visibleSections.length > 0 ? (
                visibleSections.map((section) =>
                  section.type === "favorites" ? (
                    <FavoritesSection
                      key={section.key}
                      books={section.books}
                      onBookOpen={onBookOpen}
                      onShowAll={() => selectFilter("Favoritos")}
                    />
                  ) : (
                    <BookRail
                      key={section.key}
                      title={section.title}
                      action={activeFilter === "Todos" ? "Ver todos" : undefined}
                      books={section.books}
                      onAction={() => selectFilter(section.filter)}
                      onBookOpen={onBookOpen}
                      muted={section.muted}
                    />
                  )
                )
              ) : (
                <EmptyFilter filter={activeFilter} />
              )}
            </>
          ) : (
            <EmptyShelf
              onAddBook={onAddToShelf}
              onExplore={() => onNavigate?.("search")}
            />
          )}
        </ScrollView>

        <BottomNav activeTab="library" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function getVisibleSections(activeFilter, shelfBooks) {
  const sections = [
    { key: "favorites", type: "favorites", title: "Favoritos", books: shelfBooks.favorites },
    { key: "reading", filter: "Lendo", title: "Lendo agora", books: shelfBooks.reading },
    { key: "want", filter: "Quero ler", title: "Quero ler", books: shelfBooks.want },
    { key: "read", filter: "Lidos", title: "Lidos", books: shelfBooks.read },
    { key: "abandoned", filter: "Abandonados", title: "Abandonados", books: shelfBooks.abandoned, muted: true }
  ];

  if (activeFilter === "Todos") {
    return sections.filter((section) => section.books.length > 0);
  }

  const filterMap = {
    Favoritos: "favorites",
    Lendo: "reading",
    "Quero ler": "want",
    Lidos: "read",
    Abandonados: "abandoned"
  };

  return sections.filter((section) => section.key === filterMap[activeFilter] && section.books.length > 0);
}

function EmptyShelf({ onAddBook, onExplore }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Icon name="books" color={colors.accent} size={34} />
      </View>
      <Text style={styles.emptyTitle}>Sua estante ainda esta vazia</Text>
      <Text style={styles.emptyText}>
        Comece adicionando livros que voce quer ler, ja leu, esta lendo ou decidiu abandonar.
      </Text>
      <Pressable onPress={onAddBook} style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Adicionar primeiro livro</Text>
      </Pressable>
      <Pressable onPress={onExplore} style={styles.emptyGhostButton}>
        <Text style={styles.emptyGhostText}>Explorar livros</Text>
      </Pressable>
    </View>
  );
}

function FavoritesSection({ books, onBookOpen, onShowAll }) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Favoritos" action="Ver todos" onAction={onShowAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesRail}
      >
        {books.map((book) => (
          <Pressable key={`favorite-${book.id}`} onPress={() => onBookOpen?.(book.id)} style={styles.favoriteCard}>
            <BookCover book={book} size="medium" />
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteLabel}>queridinho</Text>
              <Text style={styles.favoriteTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.favoriteAuthor} numberOfLines={1}>{book.author}</Text>
              <RatingStars rating={5} size={14} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function BookRail({ title, action, books, onAction, onBookOpen, muted = false }) {
  return (
    <View style={[styles.section, muted && styles.mutedSection]}>
      <SectionHeader title={title} action={action} onAction={onAction} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookRail}>
        {books.map((book) => (
          <Pressable key={`${title}-${book.id}`} onPress={() => onBookOpen?.(book.id)} style={styles.bookItem}>
            <View style={muted && styles.mutedCover}>
              <BookCover book={book} size="medium" />
            </View>
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function EmptyFilter({ filter }) {
  return (
    <View style={styles.emptyFilter}>
      <Text style={styles.emptyFilterTitle}>Nada em {filter.toLowerCase()}</Text>
      <Text style={styles.emptyFilterText}>Quando voce marcar livros nessa categoria, eles aparecem aqui.</Text>
    </View>
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
  statsGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  statCard: {
    flex: 1,
    minHeight: 68,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center"
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    marginTop: 4
  },
  filters: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.lg
  },
  filterChip: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeChip: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.2)"
  },
  filterText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeFilterText: {
    color: colors.text
  },
  section: {
    marginBottom: spacing.xl
  },
  mutedSection: {
    opacity: 0.7
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
  favoritesRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md
  },
  favoriteCard: {
    width: 236,
    minHeight: 150,
    borderRadius: 24,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 28,
    elevation: 10
  },
  favoriteInfo: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2
  },
  favoriteLabel: {
    ...type.label,
    color: colors.warm,
    textTransform: "uppercase",
    lineHeight: 12
  },
  favoriteTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 21,
    marginTop: 6
  },
  favoriteAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3,
    marginBottom: spacing.sm
  },
  bookRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md
  },
  bookItem: {
    width: 112
  },
  mutedCover: {
    opacity: 0.78
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
  emptyFilter: {
    marginHorizontal: spacing.lg,
    minHeight: 128,
    borderRadius: 24,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyFilterTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  emptyFilterText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm
  },
  emptyWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: 84,
    alignItems: "center"
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)",
    marginBottom: spacing.lg
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center"
  },
  emptyText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl
  },
  emptyButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    marginBottom: spacing.sm
  },
  emptyButtonText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  emptyGhostButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyGhostText: {
    color: colors.accent,
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    textDecorationLine: "underline"
  }
});
