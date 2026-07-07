import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { getBooks } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const filters = ["Todos", "Lendo", "Quero ler", "Lidos"];
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
  const visibleSections = useMemo(
    () => getVisibleSections(activeFilter, shelfBooks),
    [activeFilter, shelfBooks]
  );
  const sectionsToRender = useMemo(
    () =>
      activeFilter === "Todos" && shelfBooks.reading.length > 0
        ? visibleSections.filter((section) => section.key !== "reading")
        : visibleSections,
    [activeFilter, shelfBooks.reading.length, visibleSections]
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
              {activeFilter === "Todos" && shelfBooks.reading.length > 0 ? (
                <ReadingNowSection books={shelfBooks.reading} onBookOpen={onBookOpen} />
              ) : null}

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

              {sectionsToRender.length > 0 ? (
                sectionsToRender.map((section) =>
                  section.type === "favorites" ? (
                    <FavoritesSection
                      key={section.key}
                      books={section.books}
                      onBookOpen={onBookOpen}
                    />
                  ) : (
                    <BookRail
                      key={section.key}
                      title={section.title}
                      hint={section.hint}
                      books={section.books}
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
    {
      key: "reading",
      filter: "Lendo",
      title: "Lendo agora",
      hint: "livros em andamento",
      books: shelfBooks.reading
    },
    {
      key: "want",
      filter: "Quero ler",
      title: "Quero ler",
      hint: "proximas escolhas",
      books: shelfBooks.want
    },
    {
      key: "read",
      filter: "Lidos",
      title: "Lidos",
      hint: "ja passaram pela sua estante",
      books: shelfBooks.read
    },
    { key: "favorites", type: "favorites", title: "Favoritos", books: shelfBooks.favorites },
    {
      key: "abandoned",
      filter: "Abandonados",
      title: "Abandonados",
      hint: "pausados ou deixados para depois",
      books: shelfBooks.abandoned,
      muted: true
    }
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

function ReadingNowSection({ books, onBookOpen }) {
  const [expanded, setExpanded] = useState(false);
  const visibleBooks = expanded ? books : books.slice(0, 4);
  const hasMore = visibleBooks.length < books.length;

  return (
    <View style={styles.readingBlock}>
      <SectionHeader
        title="Lendo agora"
        hint={books.length > 1 ? `${books.length} leituras em andamento` : "sua leitura em andamento"}
        action={hasMore ? "Ver mais" : undefined}
        onAction={() => setExpanded(true)}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.readingRail}>
        {visibleBooks.map((book) => (
          <Pressable key={`reading-now-${book.id}`} onPress={() => onBookOpen?.(book.id)} style={styles.readingCard}>
            <View style={styles.readingCover}>
              <BookCover book={book} size="medium" />
            </View>
            <View style={styles.readingCopy}>
              <Text style={styles.readingStatus}>em andamento</Text>
              <Text style={styles.readingTitle} numberOfLines={3}>{book.title}</Text>
              <Text style={styles.readingAuthor} numberOfLines={1}>{book.author}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
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

function FavoritesSection({ books, onBookOpen }) {
  const [expanded, setExpanded] = useState(false);
  const visibleBooks = expanded ? books : books.slice(0, 4);
  const hasMore = visibleBooks.length < books.length;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Favoritos"
        hint="os livros que voce quer destacar"
        action={hasMore ? "Ver mais" : undefined}
        onAction={() => setExpanded(true)}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesRail}
      >
        {visibleBooks.map((book) => (
          <Pressable key={`favorite-${book.id}`} onPress={() => onBookOpen?.(book.id)} style={styles.favoriteCard}>
            <BookCover book={book} size="medium" />
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteLabel}>queridinho</Text>
              <Text style={styles.favoriteTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.favoriteAuthor} numberOfLines={1}>{book.author}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function BookRail({ title, hint, books, onBookOpen, muted = false }) {
  const [expanded, setExpanded] = useState(false);
  const visibleBooks = expanded ? books : books.slice(0, 6);
  const hasMore = visibleBooks.length < books.length;

  return (
    <View style={[styles.section, muted && styles.mutedSection]}>
      <SectionHeader
        title={title}
        hint={hint}
        action={hasMore ? "Ver mais" : undefined}
        onAction={() => setExpanded(true)}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookRail}>
        {visibleBooks.map((book) => (
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

function SectionHeader({ title, hint, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleBlock}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      </View>
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
  readingBlock: {
    marginBottom: spacing.xl
  },
  readingRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md
  },
  readingCard: {
    width: 236,
    minHeight: 178,
    borderRadius: 24,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.18)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 26,
    elevation: 8
  },
  readingCover: {
    width: 112
  },
  readingCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center"
  },
  readingStatus: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase",
    marginBottom: 8
  },
  readingTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25
  },
  readingAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 6
  },
  filters: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  filterChip: {
    minHeight: 30,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  activeChip: {
    backgroundColor: "rgba(157,192,216,0.12)",
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
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sectionTitleBlock: {
    flex: 1,
    paddingRight: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  sectionHint: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2
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
    width: 124,
    minHeight: 170,
    borderRadius: 22,
    padding: spacing.sm,
    paddingBottom: spacing.md,
    alignItems: "center",
    flexDirection: "column",
    gap: spacing.sm,
    backgroundColor: "rgba(196,145,74,0.075)",
    borderWidth: 1,
    borderColor: "rgba(196,145,74,0.18)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 5
  },
  favoriteInfo: {
    width: "100%",
    minWidth: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  favoriteLabel: {
    ...type.label,
    color: colors.warm,
    textTransform: "uppercase",
    marginBottom: 6
  },
  favoriteTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 19,
    textAlign: "center"
  },
  favoriteAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4,
    textAlign: "center"
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
