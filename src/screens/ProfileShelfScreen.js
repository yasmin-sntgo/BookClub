import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { getBooks, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const mockBooks = getBooks();
const mockUsers = getUsers();

const shelfByUser = {
  lia: [
    { bookId: "dune", status: "reading", favorite: true },
    { bookId: "sunrise", status: "want", favorite: false },
    { bookId: "foundation", status: "want", favorite: false },
    { bookId: "hobbit", status: "read", favorite: true },
    { bookId: "it", status: "abandoned", favorite: false }
  ],
  marcos: [
    { bookId: "foundation", status: "reading", favorite: true },
    { bookId: "dune", status: "want", favorite: false },
    { bookId: "hobbit", status: "want", favorite: false },
    { bookId: "it", status: "read", favorite: false },
    { bookId: "housemaid", status: "abandoned", favorite: false }
  ],
  carol: [
    { bookId: "it", status: "reading", favorite: true },
    { bookId: "housemaid", status: "want", favorite: false },
    { bookId: "sunrise", status: "want", favorite: false },
    { bookId: "dune", status: "read", favorite: false }
  ],
  yasmin: [
    { bookId: "dune", status: "reading", favorite: true },
    { bookId: "it", status: "reading", favorite: false },
    { bookId: "sunrise", status: "want", favorite: false },
    { bookId: "hobbit", status: "read", favorite: true },
    { bookId: "housemaid", status: "abandoned", favorite: false }
  ]
};

const sectionConfig = [
  { key: "reading", title: "Lendo", match: (entry) => entry.status === "reading" },
  { key: "want", title: "Quero ler", match: (entry) => entry.status === "want" },
  { key: "read", title: "Lidos", match: (entry) => entry.status === "read" },
  { key: "favorites", title: "Favoritos", match: (entry) => entry.favorite },
  { key: "abandoned", title: "Abandonados", match: (entry) => entry.status === "abandoned" }
];

export function ProfileShelfScreen({
  privateShelf = false,
  userId = "lia",
  shelfEntries = [],
  onBack,
  onBookOpen,
  onCreate,
  onNavigate
}) {
  const user = mockUsers.find((item) => item.id === userId) ?? mockUsers[0];
  const userShelfEntries = useMemo(
    () => (userId === "yasmin" && shelfEntries.length > 0 ? shelfEntries : getMockShelfEntries(user)),
    [shelfEntries, user, userId]
  );
  const shelfSections = useMemo(() => buildShelfSections(userShelfEntries), [userShelfEntries]);
  const totalBooks = useMemo(
    () => new Set(userShelfEntries.map((entry) => entry.bookId)).size,
    [userShelfEntries]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Estante</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{user.name}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {privateShelf ? (
            <View style={styles.privateCard}>
              <View style={styles.privateIcon}>
                <Icon name="books" color={colors.accent} size={32} />
              </View>
              <Text style={styles.privateTitle}>Estante privada</Text>
              <Text style={styles.privateText}>
                Esta pessoa escolheu nao mostrar os livros marcados no perfil.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.summary}>
                <Text style={styles.summaryValue}>{totalBooks}</Text>
                <Text style={styles.summaryLabel}>livros marcados</Text>
              </View>

              {shelfSections.map((section) => (
                <ShelfSection
                  key={section.key}
                  section={section}
                  onBookOpen={onBookOpen}
                />
              ))}
            </>
          )}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function getMockShelfEntries(user) {
  if (shelfByUser[user.id]) {
    return shelfByUser[user.id];
  }

  return [
    ...(user.favoriteBookIds?.slice(0, 1).map((bookId) => ({ bookId, status: "reading", favorite: true })) ?? []),
    { bookId: "sunrise", status: "want", favorite: false },
    { bookId: "foundation", status: "want", favorite: false },
    ...(user.favoriteBookIds?.slice(1, 2).map((bookId) => ({ bookId, status: "read", favorite: true })) ?? [])
  ];
}

function buildShelfSections(entries) {
  const booksById = mockBooks.reduce((books, book) => ({ ...books, [book.id]: book }), {});
  const entriesWithBooks = entries
    .map((entry) => ({ ...entry, book: booksById[entry.bookId] }))
    .filter((entry) => entry.book);

  return sectionConfig
    .map((section) => ({
      key: section.key,
      title: section.title,
      books: entriesWithBooks.filter(section.match).map((entry) => entry.book)
    }))
    .filter((section) => section.books.length > 0);
}

function ShelfSection({ section, onBookOpen }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionCount}>{section.books.length}</Text>
      </View>
      <View style={styles.bookList}>
        {section.books.map((book) => (
          <Pressable
            accessibilityRole="button"
            key={`${section.key}-${book.id}`}
            onPress={() => onBookOpen?.(book.id)}
            style={styles.bookRow}
          >
            <BookCover book={book} size="small" />
            <View style={styles.bookCopy}>
              <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
            </View>
          </Pressable>
        ))}
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
  headerSpacer: {
    width: 42,
    height: 42
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
    paddingBottom: 116
  },
  summary: {
    minHeight: 86,
    borderRadius: 24,
    padding: spacing.md,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  summaryValue: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  section: {
    marginBottom: spacing.xl
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  sectionCount: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16
  },
  bookList: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  bookRow: {
    minHeight: 82,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  bookCopy: {
    flex: 1,
    minWidth: 0
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  bookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  privateCard: {
    minHeight: 260,
    borderRadius: 28,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  privateIcon: {
    width: 72,
    height: 72,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)",
    marginBottom: spacing.lg
  },
  privateTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 25,
    lineHeight: 30,
    textAlign: "center"
  },
  privateText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: spacing.sm
  }
});
