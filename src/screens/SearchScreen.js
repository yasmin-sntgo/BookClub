import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { getBooks, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const tabs = ["Livros", "Usuarios", "Listas"];
const mockBooks = getBooks();
const mockUsers = getUsers();

const genres = [
  { name: "Fantasia", detail: "dragoes, magia, jornadas" },
  { name: "Terror", detail: "medo, suspense, escuro" },
  { name: "Romance", detail: "afetos, drama, encontros" },
  { name: "Ficcao cientifica", detail: "futuro, espaco, ideias" },
  { name: "Distopia", detail: "revoltas, governos, escolhas" },
  { name: "Suspense", detail: "segredos, pistas, tensao" }
];

export function SearchScreen({
  initialQuery = "",
  initialTab = "Livros",
  followedUserIds = [],
  lists = [],
  onBookOpen,
  onCreate,
  onListOpen,
  onNavigate,
  onQueryChange,
  onToggleFollow,
  onToggleListSave,
  onTabChange,
  onUserOpen,
  savedListIds = []
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const booksById = useMemo(
    () => Object.fromEntries(mockBooks.map((book) => [book.id, book])),
    []
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleTabChange(nextTab) {
    setActiveTab(nextTab);
    onTabChange?.(nextTab);
  }

  function handleQueryChange(nextQuery) {
    setQuery(nextQuery);
    onQueryChange?.(nextQuery);
  }

  function clearQuery() {
    handleQueryChange("");
  }

  function handleGenrePress(genreName) {
    handleTabChange("Livros");
    handleQueryChange(genreName);
  }

  const filteredBooks = useMemo(
    () =>
      normalizedQuery
        ? mockBooks.filter((book) =>
            `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(normalizedQuery)
          )
        : mockBooks,
    [normalizedQuery]
  );

  const filteredUsers = useMemo(
    () =>
      normalizedQuery
        ? mockUsers.filter((user) =>
            `${user.name} ${user.handle} ${user.bio}`.toLowerCase().includes(normalizedQuery)
          )
        : mockUsers,
    [normalizedQuery]
  );

  const filteredLists = useMemo(
    () => {
      const visibleLists = lists.filter((list) => !list.private);

      return normalizedQuery
        ? visibleLists.filter((list) =>
            `${list.title} ${list.creator} ${list.handle} ${list.description} ${list.tag}`.toLowerCase().includes(normalizedQuery)
          )
        : visibleLists;
    },
    [lists, normalizedQuery]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Busca</Text>
            <Text style={styles.subtitle}>encontre livros, pessoas e listas</Text>
          </View>
          <View style={styles.searchBox}>
            {query ? (
              <Pressable accessibilityRole="button" onPress={clearQuery} hitSlop={8} style={styles.clearFilterButton}>
                <Icon name="back" color={colors.textSoft} size={22} strokeWidth={2.3} />
              </Pressable>
            ) : (
              <Icon name="search" color={colors.textMuted} size={21} />
            )}
            <TextInput
              value={query}
              onChangeText={handleQueryChange}
              placeholder="Buscar por titulo, autor, usuario, lista..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="button"
              onPress={() => handleTabChange(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "Livros" ? (
            <BooksSearch
              books={filteredBooks}
              showDiscovery={!normalizedQuery}
              showAllGenres={showAllGenres}
              onGenrePress={handleGenrePress}
              onBookOpen={onBookOpen}
              onShowAllGenres={() => setShowAllGenres(true)}
            />
          ) : null}
          {activeTab === "Usuarios" ? (
            <UsersSearch
              followedUserIds={followedUserIds}
              users={filteredUsers}
              onToggleFollow={onToggleFollow}
              onUserOpen={onUserOpen}
            />
          ) : null}
          {activeTab === "Listas" ? (
            <ListsSearch
              lists={filteredLists}
              booksById={booksById}
              onBookOpen={onBookOpen}
              onListOpen={onListOpen}
              onToggleListSave={onToggleListSave}
              savedListIds={savedListIds}
            />
          ) : null}
        </ScrollView>

        <BottomNav activeTab="search" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function BooksSearch({
  books,
  showDiscovery,
  showAllGenres,
  onBookOpen,
  onGenrePress,
  onShowAllGenres
}) {
  const visibleGenres = showAllGenres ? genres : genres.slice(0, 4);
  const visibleBooks = books;

  return (
    <>
      {showDiscovery ? (
        <View style={styles.section}>
          <SectionHeader
            title="Explorar generos"
            action={showAllGenres ? null : "Todos"}
            onAction={onShowAllGenres}
          />
          <View style={styles.genresGrid}>
            {visibleGenres.map((genre) => (
              <Pressable key={genre.name} onPress={() => onGenrePress?.(genre.name)} style={styles.genreCard}>
                <Text style={styles.genreTitle}>{genre.name}</Text>
                <Text style={styles.genreDetail}>{genre.detail}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title={showDiscovery ? "Livros em alta" : "Resultados"}
        />
        <View style={styles.bookGrid}>
          {visibleBooks.map((book) => (
            <Pressable key={book.id} onPress={() => onBookOpen?.(book.id)} style={styles.bookItem}>
              <BookCover book={book} size="grid" />
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
            </Pressable>
          ))}
        </View>
        {visibleBooks.length === 0 ? <EmptyResults text="Nenhum livro encontrado." /> : null}
      </View>
    </>
  );
}

function UsersSearch({ followedUserIds, users, onToggleFollow, onUserOpen }) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Usuarios" />
      <View style={styles.resultList}>
        {users.map((user) => (
          <ResultRow
            key={user.id}
            avatar={user.avatar}
            title={user.name}
            subtitle={`${user.handle} - ${user.bio}`}
            action={user.id === "yasmin" ? "Voce" : followedUserIds.includes(user.id) ? "Seguindo" : "Seguir"}
            activeAction={followedUserIds.includes(user.id)}
            disabledAction={user.id === "yasmin"}
            onAction={() => user.id !== "yasmin" && onToggleFollow?.(user.id)}
            onPress={() => onUserOpen?.(user.id)}
          />
        ))}
        {users.length === 0 ? <EmptyResults text="Nenhum usuario encontrado." /> : null}
      </View>
    </View>
  );
}

function ListsSearch({ lists, booksById, onBookOpen, onListOpen, onToggleListSave, savedListIds }) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Listas" />
      <View style={styles.resultList}>
        {lists.map((list) => (
          <ListResult
            key={list.id}
            list={list}
            books={list.bookIds.map((bookId) => booksById[bookId]).filter(Boolean)}
            onBookOpen={onBookOpen}
            onListOpen={onListOpen}
            onToggleListSave={onToggleListSave}
            saved={savedListIds.includes(list.id)}
          />
        ))}
        {lists.length === 0 ? <EmptyResults text="Nenhuma lista encontrada." /> : null}
      </View>
    </View>
  );
}

function ListResult({ list, books, saved, onBookOpen, onListOpen, onToggleListSave }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onListOpen?.(list.id)} style={styles.listResult}>
      <View style={styles.listCoverStack}>
        {books.slice(0, 3).map((book, index) => (
          <Pressable
            accessibilityRole="button"
            key={`${list.id}-${book.id}`}
            onPress={(event) => {
              event.stopPropagation?.();
              onBookOpen?.(book.id);
            }}
            style={[styles.listMiniCover, { left: index * 18, zIndex: 4 - index }]}
          >
            <BookCover book={book} size="small" />
          </Pressable>
        ))}
      </View>
      <View style={styles.resultCopy}>
        <Text style={styles.resultTitle} numberOfLines={1}>{list.title}</Text>
        <Text style={styles.resultSubtitle} numberOfLines={2}>
          {list.booksCount} livros - {list.saves} salvos - {list.handle}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={(event) => {
          event.stopPropagation?.();
          onToggleListSave?.(list.id);
        }}
        style={[styles.miniButton, saved && styles.miniButtonActive]}
      >
        <Text style={[styles.miniButtonText, saved && styles.miniButtonTextActive]}>{saved ? "Salva" : "Salvar"}</Text>
      </Pressable>
    </Pressable>
  );
}

function ResultRow({ avatar, title, subtitle, action, activeAction = false, disabledAction = false, onAction, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.resultRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar}</Text>
      </View>
      <View style={styles.resultCopy}>
        <Text style={styles.resultTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.resultSubtitle} numberOfLines={2}>{subtitle}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={disabledAction}
        onPress={(event) => {
          event.stopPropagation?.();
          onAction?.();
        }}
        style={[styles.miniButton, activeAction && styles.miniButtonActive, disabledAction && styles.miniButtonDisabled]}
      >
        <Text style={[styles.miniButtonText, activeAction && styles.miniButtonTextActive, disabledAction && styles.miniButtonTextDisabled]}>{action}</Text>
      </Pressable>
    </Pressable>
  );
}

function EmptyResults({ text }) {
  return (
    <View style={styles.emptyResults}>
      <Text style={styles.emptyResultsText}>{text}</Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(16,16,16,0.96)"
  },
  titleBlock: {
    marginBottom: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 36
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 4
  },
  searchBox: {
    minHeight: 50,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  clearFilterButton: {
    width: 28,
    height: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    paddingVertical: 0
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
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  section: {
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
  genresGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  genreCard: {
    width: "48%",
    minHeight: 76,
    borderRadius: 20,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border
  },
  genreTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20
  },
  genreDetail: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    marginTop: spacing.sm
  },
  bookGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: 12,
    rowGap: 18
  },
  bookItem: {
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
  resultList: {
    paddingHorizontal: spacing.md,
    gap: 10
  },
  resultRow: {
    minHeight: 74,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 12
  },
  listResult: {
    minHeight: 94,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 12
  },
  listCoverStack: {
    width: 94,
    height: 76,
    position: "relative"
  },
  listMiniCover: {
    position: "absolute",
    top: 0
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
  resultCopy: {
    flex: 1,
    minWidth: 0
  },
  resultTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  resultSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  miniButton: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)"
  },
  miniButtonActive: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: colors.border
  },
  miniButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.025)",
    borderColor: "rgba(240,236,228,0.08)"
  },
  miniButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 11
  },
  miniButtonTextActive: {
    color: colors.textSoft
  },
  miniButtonTextDisabled: {
    color: colors.textMuted
  },
  emptyResults: {
    minHeight: 92,
    marginHorizontal: spacing.lg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    padding: spacing.md
  },
  emptyResultsText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  }
});
