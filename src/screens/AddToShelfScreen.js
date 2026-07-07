import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { getBooks } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const statusOptions = [
  { id: "want", title: "Quero ler", description: "para lembrar depois" },
  { id: "reading", title: "Lendo", description: "esta na sua leitura atual" },
  { id: "read", title: "Lido", description: "ja terminou esse livro" },
  { id: "abandoned", title: "Abandonado", description: "parou e quer registrar" }
];
const mockBooks = getBooks();
const favoriteColor = colors.warm;

export function AddToShelfScreen({
  initialBookId = null,
  shelfEntries = [],
  onBack,
  onCreate,
  onNavigate,
  onSave
}) {
  const fallbackBookId =
    initialBookId ??
    mockBooks.find((book) => !shelfEntries.some((entry) => entry.bookId === book.id))?.id ??
    mockBooks[0]?.id;
  const [selectedBookId, setSelectedBookId] = useState(fallbackBookId);
  const [status, setStatus] = useState("want");
  const [favorite, setFavorite] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const saveTimeoutRef = useRef(null);
  const favoriteScale = useRef(new Animated.Value(1)).current;
  const statusAnimations = useRef(
    Object.fromEntries(statusOptions.map((option) => [option.id, new Animated.Value(option.id === "want" ? 1 : 0)]))
  ).current;
  const selectedBook = mockBooks.find((book) => book.id === selectedBookId) ?? mockBooks[0];
  const currentEntry = shelfEntries.find((entry) => entry.bookId === selectedBook?.id);

  useEffect(() => {
    const nextBookId = fallbackBookId;
    const nextEntry = shelfEntries.find((entry) => entry.bookId === nextBookId);

    setSelectedBookId(nextBookId);
    setStatus(nextEntry?.status ?? "want");
    setFavorite(Boolean(nextEntry?.favorite));
  }, [fallbackBookId, shelfEntries]);

  useEffect(() => {
    statusOptions.forEach((option) => {
      Animated.spring(statusAnimations[option.id], {
        toValue: status === option.id ? 1 : 0,
        useNativeDriver: true,
        speed: 22,
        bounciness: 5
      }).start();
    });
  }, [status, statusAnimations]);

  useEffect(() => () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return mockBooks;
    }

    return mockBooks.filter((book) =>
      `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  function selectBook(bookId) {
    const nextEntry = shelfEntries.find((entry) => entry.bookId === bookId);

    setSelectedBookId(bookId);
    setStatus(nextEntry?.status ?? "want");
    setFavorite(Boolean(nextEntry?.favorite));
  }

  function selectStatus(nextStatus) {
    setStatus(nextStatus);
  }

  function toggleFavorite() {
    setFavorite((current) => !current);
    favoriteScale.setValue(0.92);
    Animated.spring(favoriteScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 7
    }).start();
  }

  function saveEntry() {
    if (!selectedBook) {
      return;
    }

    setNotice(currentEntry ? "Estante atualizada." : "Livro salvo na estante.");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave?.({
        bookId: selectedBook.id,
        status,
        favorite
      });
    }, 520);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Adicionar a estante</Text>
            <Text style={styles.subtitle}>marque um livro na sua biblioteca</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Livro escolhido</Text>
          <View style={styles.selectedCard}>
            <BookCover book={selectedBook} size="small" />
            <View style={styles.selectedCopy}>
              <Text style={styles.selectedMeta}>
                {currentEntry ? "ja esta na estante" : "novo na estante"}
              </Text>
              <Text style={styles.selectedTitle} numberOfLines={2}>{selectedBook.title}</Text>
              <Text style={styles.selectedAuthor} numberOfLines={1}>
                {selectedBook.author} - {selectedBook.genre}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Buscar livro</Text>
          <View style={styles.searchBox}>
            <Icon name="search" color={colors.textMuted} size={20} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Titulo, autor ou genero..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.bookList}>
            {filteredBooks.map((book) => {
              const isSelected = book.id === selectedBook?.id;
              const entry = shelfEntries.find((item) => item.bookId === book.id);

              return (
                <Pressable
                  key={book.id}
                  onPress={() => selectBook(book.id)}
                  style={[styles.bookOption, isSelected && styles.selectedBookOption]}
                >
                  <BookCover book={book} size="small" />
                  <View style={styles.bookOptionCopy}>
                    <Text style={styles.bookOptionTitle} numberOfLines={1}>{book.title}</Text>
                    <Text style={styles.bookOptionAuthor} numberOfLines={1}>{book.author}</Text>
                    {entry ? <Text style={styles.bookOptionMeta}>ja marcado</Text> : null}
                  </View>
                  <View style={[styles.selectDot, isSelected && styles.selectDotActive]} />
                </Pressable>
              );
            })}
            {filteredBooks.length === 0 ? (
              <View style={styles.emptySearch}>
                <Text style={styles.emptySearchText}>Nenhum livro encontrado.</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.sectionLabel}>Como marcar</Text>
          <View style={styles.statusGrid}>
            {statusOptions.map((option) => {
              const active = status === option.id;
              const scale = statusAnimations[option.id].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.025]
              });

              return (
                <Animated.View key={option.id} style={[styles.statusCardWrap, { transform: [{ scale }] }]}>
                  <Pressable
                    onPress={() => selectStatus(option.id)}
                    style={[styles.statusCard, active && styles.activeStatusCard]}
                  >
                    <Text style={[styles.statusTitle, active && styles.activeStatusTitle]}>
                      {option.title}
                    </Text>
                    <Text style={styles.statusDescription}>{option.description}</Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <Pressable
            onPress={toggleFavorite}
            style={[styles.favoriteRow, favorite && styles.favoriteRowActive]}
          >
            <Animated.View style={[styles.favoriteIcon, { transform: [{ scale: favoriteScale }] }]}>
              <Icon
                name="heart"
                color={favorite ? favoriteColor : colors.textSoft}
                fill={favorite ? favoriteColor : "none"}
                size={22}
              />
            </Animated.View>
            <View style={styles.favoriteCopy}>
              <Text style={styles.favoriteTitle}>Favorito</Text>
              <Text style={styles.favoriteText}>tambem aparece na area de favoritos da Estante</Text>
            </View>
          </Pressable>

          <Pressable onPress={saveEntry} style={styles.saveButton}>
            <Text style={styles.saveText}>{currentEntry ? "Atualizar estante" : "Salvar na estante"}</Text>
          </Pressable>
        </ScrollView>

        <BottomNav activeTab="library" onChange={onNavigate} onCreate={onCreate} />
        {notice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
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
    minHeight: 104,
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
  headerCopy: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.sm
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 25,
    lineHeight: 30,
    textAlign: "center"
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    textAlign: "center"
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: 120
  },
  sectionLabel: {
    ...type.label,
    color: colors.textMuted,
    textTransform: "uppercase",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm
  },
  selectedCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: 12,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  selectedCopy: {
    flex: 1,
    minWidth: 0
  },
  selectedMeta: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase"
  },
  selectedTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    marginTop: spacing.sm
  },
  selectedAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3
  },
  searchBox: {
    minHeight: 48,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    paddingVertical: 0
  },
  bookList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  bookOption: {
    minHeight: 74,
    borderRadius: 18,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  selectedBookOption: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.24)"
  },
  bookOptionCopy: {
    flex: 1,
    minWidth: 0
  },
  bookOptionTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  bookOptionAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2
  },
  bookOptionMeta: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 3
  },
  selectDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.2)"
  },
  selectDotActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent
  },
  emptySearch: {
    minHeight: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptySearchText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 13
  },
  statusGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  statusCardWrap: {
    width: "48.5%",
    minHeight: 86
  },
  statusCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 20,
    padding: spacing.md,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeStatusCard: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.26)"
  },
  statusTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 23
  },
  activeStatusTitle: {
    color: colors.accentStrong
  },
  statusDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4
  },
  favoriteRow: {
    minHeight: 72,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  favoriteRowActive: {
    backgroundColor: "rgba(196,145,74,0.075)",
    borderColor: "rgba(196,145,74,0.18)"
  },
  favoriteIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  favoriteCopy: {
    flex: 1,
    minWidth: 0
  },
  favoriteTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14
  },
  favoriteText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  saveButton: {
    minHeight: 52,
    marginHorizontal: spacing.lg,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  saveText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  noticeToast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 104,
    minHeight: 52,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(29,29,29,0.98)",
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.34)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 14
  },
  noticeText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  }
});
