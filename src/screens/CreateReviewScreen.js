import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { getBooks } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const mockBooks = getBooks();

export function CreateReviewScreen({ bookId = null, mode = "review", onBack, onCreate, onNavigate, onSave }) {
  const [activeMode, setActiveMode] = useState(mode);
  const [selectedBookId, setSelectedBookId] = useState(bookId);
  const [bookPickerOpen, setBookPickerOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [text, setText] = useState("");
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [notice, setNotice] = useState("");
  const saveTimeoutRef = useRef(null);
  const book = selectedBookId ? mockBooks.find((item) => item.id === selectedBookId) : null;
  const isReviewMode = activeMode === "review";
  const canPublish = Boolean(book && rating && (!isReviewMode || text.trim().length > 0));

  useEffect(() => {
    setActiveMode(mode);
    setSelectedBookId(bookId);
    setNotice("");
  }, [bookId, mode]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timeout);
  }, [notice]);

  useEffect(() => () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  function selectRating(nextRating) {
    setRating(nextRating);
  }

  function handleSave() {
    if (!book) {
      setNotice("Escolha um livro antes de continuar.");
      return;
    }

    if (!rating) {
      setNotice("Escolha uma nota para este livro.");
      return;
    }

    if (isReviewMode && !text.trim()) {
      setNotice("Escreva o texto da resenha antes de publicar.");
      return;
    }

    setNotice(isReviewMode ? "Resenha publicada." : "Avaliacao salva.");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave?.({
        mode: activeMode,
        bookId: book.id,
        rating,
        text: text.trim(),
        hasSpoiler
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
          <Text style={styles.title}>{isReviewMode ? "Nova resenha" : "Avaliar"}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            style={[styles.publishButton, !canPublish && styles.publishButtonDisabled]}
          >
            <Text style={[styles.publishText, !canPublish && styles.publishTextDisabled]}>
              {isReviewMode ? "Publicar" : "Salvar"}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.modeTabs}>
            <ModeTab label="Resenha" active={activeMode === "review"} onPress={() => setActiveMode("review")} />
            <ModeTab label="Avaliar" active={activeMode === "rating"} onPress={() => setActiveMode("rating")} />
          </View>

          <SectionHeader title="Livro" action={book ? "Trocar" : null} onAction={() => setBookPickerOpen(true)} />
          <Pressable onPress={() => setBookPickerOpen(true)} style={[styles.bookCard, !book && styles.emptyBookCard]}>
            {book ? (
              <>
                <BookCover book={book} size="small" />
                <View style={styles.bookCopy}>
                  <Text style={styles.bookLabel}>{isReviewMode ? "voce esta resenhando" : "voce esta avaliando"}</Text>
                  <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>{book.author} - {book.genre}</Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyBookContent}>
                <View style={styles.emptyBookIcon}>
                  <Icon name="books" color={colors.accent} size={28} />
                </View>
                <Text style={styles.emptyBookTitle}>Escolha um livro</Text>
                <Text style={styles.emptyBookText}>Selecione qual livro voce quer resenhar ou avaliar.</Text>
                <View style={styles.chooseBookButton}>
                  <Text style={styles.chooseBookText}>buscar livro</Text>
                </View>
              </View>
            )}
          </Pressable>

          <SectionHeader title="Sua nota" action="obrigatoria" />
          <View style={styles.ratingCard}>
            <View style={styles.ratingRow}>
              <View style={styles.starButtons}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <RatingButton key={star} star={star} rating={rating} onPress={() => selectRating(star)} />
                ))}
              </View>
              <Text style={[styles.ratingNumber, !rating && styles.emptyRatingNumber]}>
                {rating ? `${rating}.0` : "--"}
              </Text>
            </View>
            <Text style={styles.ratingHint}>
              {rating ? "Toque nas estrelas para ajustar sua avaliacao." : "Toque em uma estrela para dar sua nota."}
            </Text>
          </View>

          {isReviewMode ? (
            <>
              <SectionHeader title="Texto" action="obrigatorio" />
              <View style={styles.writeCard}>
                <TextInput
                  multiline
                  value={text}
                  onChangeText={setText}
                  placeholder="Escreva sua resenha."
                  placeholderTextColor={colors.textMuted}
                  textAlignVertical="top"
                  style={styles.reviewInput}
                />
                <View style={styles.counter}>
                  <Text style={styles.counterText}>{text.length} caracteres</Text>
                  <Text style={styles.counterText}>{hasSpoiler ? "com spoiler" : "sem spoiler"}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.quickCard}>
              <Text style={styles.quickTitle}>Salvar apenas nota</Text>
              <Text style={styles.quickSubtitle}>
                Sua avaliacao entra no livro e no seu perfil, sem virar resenha no feed.
              </Text>
            </View>
          )}

          {isReviewMode ? (
            <>
              <SectionHeader title="Opcoes" />
              <View style={styles.settingsCard}>
                <ToggleRow
                  title="Contem spoiler"
                  description="avisa antes de outras pessoas lerem"
                  value={hasSpoiler}
                  onPress={() => setHasSpoiler((current) => !current)}
                />
              </View>
            </>
          ) : null}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
        <BookPicker
          visible={bookPickerOpen}
          selectedBookId={selectedBookId}
          onClose={() => setBookPickerOpen(false)}
          onSelect={(nextBookId) => {
            setSelectedBookId(nextBookId);
            setBookPickerOpen(false);
          }}
        />
        {notice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function RatingButton({ star, rating, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const active = Boolean(rating && star <= rating);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      scale.setValue(0.82);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6
      }).start();
    }, star * 58);

    return () => clearTimeout(timeout);
  }, [active, rating, scale, star]);

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name="star"
          color={active ? colors.warm : "rgba(240,236,228,0.18)"}
          fill={active ? colors.warm : "rgba(240,236,228,0.18)"}
          size={28}
        />
      </Animated.View>
    </Pressable>
  );
}

function ModeTab({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeTab, active && styles.activeModeTab]}>
      <Text style={[styles.modeText, active && styles.activeModeText]}>{label}</Text>
    </Pressable>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ToggleRow({ title, description, value, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <View style={[styles.switchTrack, value && styles.switchOn]}>
        <View style={[styles.switchKnob, value && styles.switchKnobOn]} />
      </View>
    </Pressable>
  );
}

function BookPicker({ visible, selectedBookId, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = normalizedQuery
    ? mockBooks.filter((book) =>
        `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(normalizedQuery)
      )
    : mockBooks;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.pickerSheet}>
          <View style={styles.handle} />
          <Text style={styles.pickerTitle}>Escolher livro</Text>
          <Text style={styles.pickerSubtitle}>Busque pelo titulo, autor ou genero do livro.</Text>
          <View style={styles.pickerSearch}>
            <Icon name="search" color={colors.textMuted} size={20} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por titulo, autor ou genero..."
              placeholderTextColor={colors.textMuted}
              style={styles.pickerSearchInput}
            />
          </View>
          <View style={styles.bookOptions}>
            {filteredBooks.map((book) => (
              <Pressable key={book.id} onPress={() => onSelect(book.id)} style={styles.bookOption}>
                <BookCover book={book} size="small" />
                <View style={styles.bookOptionCopy}>
                  <Text style={styles.bookOptionTitle} numberOfLines={1}>{book.title}</Text>
                  <Text style={styles.bookOptionAuthor} numberOfLines={1}>{book.author}</Text>
                </View>
                {selectedBookId === book.id ? <Icon name="star" color={colors.warm} size={16} /> : null}
              </Pressable>
            ))}
            {filteredBooks.length === 0 ? (
              <View style={styles.emptyPicker}>
                <Text style={styles.emptyPickerText}>Nenhum livro encontrado.</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
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
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 31
  },
  publishButton: {
    width: 76,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  publishButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: colors.border
  },
  publishText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  publishTextDisabled: {
    color: colors.textMuted
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  modeTabs: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg
  },
  modeTab: {
    flex: 1,
    minHeight: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeModeTab: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.2)"
  },
  modeText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeModeText: {
    color: colors.text
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
  bookCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: 12,
    borderRadius: 22,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyBookCard: {
    minHeight: 178,
    justifyContent: "center"
  },
  emptyBookContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyBookIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.18)",
    marginBottom: spacing.md
  },
  emptyBookTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  emptyBookText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: spacing.xs
  },
  chooseBookButton: {
    minHeight: 38,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)"
  },
  chooseBookText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  bookCopy: {
    flex: 1,
    minWidth: 0
  },
  bookLabel: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase"
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  bookAuthor: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3
  },
  searchBookButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: spacing.sm,
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.18)"
  },
  searchBookText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 11
  },
  ratingCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  starButtons: {
    flexDirection: "row",
    gap: 3
  },
  ratingNumber: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38
  },
  emptyRatingNumber: {
    color: colors.textFaint
  },
  ratingHint: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.sm
  },
  writeCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  reviewInput: {
    minHeight: 220,
    color: "#ded5c6",
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 25,
    padding: 0
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md
  },
  counterText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  quickCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  quickTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  quickSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm
  },
  settingsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  toggleRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  toggleCopy: {
    flex: 1,
    paddingRight: spacing.md
  },
  toggleTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14
  },
  toggleDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2
  },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  switchOn: {
    backgroundColor: "rgba(157,192,216,0.18)",
    borderColor: "rgba(157,192,216,0.26)"
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textSoft
  },
  switchKnobOn: {
    marginLeft: 20,
    backgroundColor: colors.accent
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  pickerSheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderRadius: 28,
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)"
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  pickerTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29
  },
  pickerSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
    marginBottom: spacing.lg
  },
  pickerSearch: {
    minHeight: 48,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  pickerSearchInput: {
    flex: 1,
    minHeight: 46,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    paddingVertical: 0
  },
  bookOptions: {
    gap: spacing.sm
  },
  bookOption: {
    minHeight: 74,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
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
  emptyPicker: {
    minHeight: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyPickerText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 13
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
