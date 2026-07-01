import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { mockBooks } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const listCategories = [
  { id: "classicos", label: "Classicos" },
  { id: "chorar", label: "Chorar" },
  { id: "ficcao cientifica", label: "Ficcao cientifica" },
  { id: "terror", label: "Terror" },
  { id: "fantasia", label: "Fantasia" },
  { id: "nacionais", label: "Nacionais" }
];

export function CreateListScreen({ onBack, onCreate, onNavigate, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatorNote, setCreatorNote] = useState("");
  const [category, setCategory] = useState("classicos");
  const [ordered, setOrdered] = useState(true);
  const [privateList, setPrivateList] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState(["dune", "hobbit", "foundation"]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const selectedBooks = selectedBookIds
    .map((bookId) => mockBooks.find((book) => book.id === bookId))
    .filter(Boolean);
  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) {
      return mockBooks;
    }

    return mockBooks.filter((book) =>
      `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);
  const canSave = title.trim().length > 0 && selectedBookIds.length > 0;

  function toggleBook(bookId) {
    setSelectedBookIds((current) =>
      current.includes(bookId) ? current.filter((id) => id !== bookId) : [...current, bookId]
    );
  }

  function saveList() {
    if (!canSave) {
      setNotice("Adicione um titulo e pelo menos um livro para criar a lista.");
      return;
    }

    onSave?.({
      title: title.trim(),
      description: description.trim(),
      creatorNote: creatorNote.trim(),
      tag: category,
      ordered,
      private: privateList,
      bookIds: selectedBookIds
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Criar lista</Text>
            <Text style={styles.subtitle}>monte sua curadoria</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={saveList}
            style={[styles.publishButton, !canSave && styles.disabledButton]}
          >
            <Text style={[styles.publishText, !canSave && styles.disabledText]}>Salvar</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionLabel title="Informacoes" />
          <View style={styles.formCard}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Nome da lista"
              placeholderTextColor={colors.textMuted}
              style={styles.titleInput}
            />
            <View style={styles.divider} />
            <TextInput
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o clima, a ideia ou o criterio dessa lista..."
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              style={styles.descriptionInput}
            />
          </View>

          <SectionLabel title="Categoria" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
            {listCategories.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() => setCategory(item.id)}
                style={[styles.categoryChip, category === item.id && styles.activeCategoryChip]}
              >
                <Text style={[styles.categoryText, category === item.id && styles.activeCategoryText]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionLabel title="Configuracao" />
          <View style={styles.settingsCard}>
            <ToggleRow
              title="Lista com ordem"
              description="usa numeracao do criador no detalhe da lista"
              value={ordered}
              onPress={() => setOrdered((current) => !current)}
            />
            <ToggleRow
              title="Lista privada"
              description="aparece so em Suas listas neste prototipo"
              value={privateList}
              onPress={() => setPrivateList((current) => !current)}
            />
          </View>

          <SectionLabel title="Livros escolhidos" />
          <View style={styles.previewCard}>
            {selectedBooks.length > 0 ? (
              <>
                <View style={styles.selectedStack}>
                  {selectedBooks.slice(0, 4).map((book, index) => (
                    <View
                      key={`selected-${book.id}`}
                      style={[styles.stackCover, { marginLeft: index === 0 ? 0 : -10, zIndex: selectedBooks.length - index }]}
                    >
                      <BookCover book={book} size="small" />
                    </View>
                  ))}
                </View>
                <View style={styles.previewCopy}>
                  <Text style={styles.previewTitle}>{selectedBooks.length} livros na lista</Text>
                  <Text style={styles.previewText} numberOfLines={2}>
                    {selectedBooks.map((book) => book.title).join(", ")}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.emptySelection}>Escolha pelo menos um livro abaixo.</Text>
            )}
          </View>

          <SectionLabel title="Buscar livros" />
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
              const selected = selectedBookIds.includes(book.id);

              return (
                <Pressable
                  accessibilityRole="button"
                  key={book.id}
                  onPress={() => toggleBook(book.id)}
                  style={[styles.bookOption, selected && styles.selectedBookOption]}
                >
                  <BookCover book={book} size="small" />
                  <View style={styles.bookCopy}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>{book.author} - {book.genre}</Text>
                  </View>
                  <View style={[styles.checkDot, selected && styles.checkDotActive]}>
                    {selected ? <Icon name="plus" color={colors.ink} size={14} strokeWidth={2.8} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <SectionLabel title="Nota do criador" />
          <View style={styles.noteCard}>
            <TextInput
              multiline
              value={creatorNote}
              onChangeText={setCreatorNote}
              placeholder="Opcional: explique por que essa lista existe."
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              style={styles.noteInput}
            />
          </View>

          {notice ? <Text style={styles.notice}>{notice}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={saveList}
            style={[styles.saveButton, !canSave && styles.disabledSaveButton]}
          >
            <Text style={[styles.saveText, !canSave && styles.disabledSaveText]}>Criar lista</Text>
          </Pressable>
        </ScrollView>

        <BottomNav activeTab="lists" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function ToggleRow({ title, description, value, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.toggleRow}>
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
  headerCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingHorizontal: spacing.sm
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 31
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  publishButton: {
    width: 76,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  disabledButton: {
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: colors.border
  },
  publishText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  disabledText: {
    color: colors.textMuted
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
  formCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 24,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  titleInput: {
    minHeight: 48,
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    padding: 0
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md
  },
  descriptionInput: {
    minHeight: 98,
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    padding: 0
  },
  categoryRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  categoryChip: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
  },
  activeCategoryChip: {
    backgroundColor: colors.accentWash,
    borderColor: "rgba(157,192,216,0.2)"
  },
  categoryText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  activeCategoryText: {
    color: colors.text
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
  previewCard: {
    minHeight: 112,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  selectedStack: {
    width: 112,
    minHeight: 80,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden"
  },
  stackCover: {
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6
  },
  previewCopy: {
    flex: 1,
    minWidth: 0
  },
  previewTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  previewText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  emptySelection: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18
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
  bookCopy: {
    flex: 1,
    minWidth: 0
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  bookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2
  },
  checkDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.2)"
  },
  checkDotActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent
  },
  noteCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  noteInput: {
    minHeight: 92,
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    padding: 0
  },
  notice: {
    color: colors.warm,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm
  },
  saveButton: {
    minHeight: 52,
    marginHorizontal: spacing.lg,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  disabledSaveButton: {
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: colors.border
  },
  saveText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  disabledSaveText: {
    color: colors.textMuted
  }
});
