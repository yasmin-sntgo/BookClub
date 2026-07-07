import { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { TextFeedbackSheet } from "../components/TextFeedbackSheet";
import { getBooks, getLists } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const mockBooks = getBooks();
const mockLists = getLists();

export function ListDetailScreen({
  listId,
  lists = mockLists,
  saved = false,
  onBack,
  onBookOpen,
  onCreate,
  onDelete,
  onEdit,
  onNavigate,
  onPrivacyChange,
  onToggleSave
}) {
  const list = lists.find((item) => item.id === listId) || lists[0] || mockLists[0];
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [privateList, setPrivateList] = useState(Boolean(list.private));
  const [menuNotice, setMenuNotice] = useState("");
  const booksById = Object.fromEntries(mockBooks.map((book) => [book.id, book]));
  const books = list.bookIds.map((bookId) => booksById[bookId]).filter(Boolean);
  const owner = list.creator === "Yasmin";
  const listLink = `bookclub://listas/${list.id}`;

  useEffect(() => {
    if (!menuNotice) {
      return undefined;
    }

    const timeout = setTimeout(() => setMenuNotice(""), 2200);
    return () => clearTimeout(timeout);
  }, [menuNotice]);

  async function handleMenuAction(action) {
    setMenuVisible(false);

    if (action === "Tornar privada" || action === "Tornar publica") {
      const nextPrivate = !privateList;
      setPrivateList(nextPrivate);
      onPrivacyChange?.(list.id, nextPrivate);
      setMenuNotice(action === "Tornar privada" ? "Lista marcada como privada." : "Lista marcada como publica.");
      return;
    }

    if (action === "Editar lista") {
      onEdit?.(list.id);
      setMenuNotice("Edicao de lista sera aberta aqui.");
      return;
    }

    if (action === "Apagar lista") {
      onDelete?.(list.id);
      return;
    }

    if (action === "Compartilhar") {
      try {
        const result = await Share.share({ message: `${list.title} - ${listLink}` });

        if (result?.action === Share.dismissedAction) {
          setMenuNotice("Compartilhamento cancelado.");
          return;
        }
      } catch (error) {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(listLink);
          setMenuNotice("Compartilhamento indisponivel. Link copiado.");
          return;
        }

        setMenuNotice(`Link da lista: ${listLink}`);
        return;
      }
      setMenuNotice("Lista pronta para compartilhar.");
      return;
    }

    if (action === "Copiar link") {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(listLink);
        setMenuNotice("Link da lista copiado.");
      } else {
        setMenuNotice("Link da lista: bookclub://listas/" + list.id);
      }
      return;
    }

    if (action === "Denunciar lista") {
      setReportOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Lista</Text>
            <Text style={styles.subtitle}>curadoria de leitor</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setMenuVisible(true)} style={styles.headerButton}>
            <Icon name="more" color={colors.textSoft} size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroKicker}>{list.tag}</Text>
            <Text style={styles.heroTitle}>{list.title}</Text>

            <View style={styles.creatorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{list.creator.slice(0, 1)}</Text>
              </View>
              <View style={styles.creatorCopy}>
                <Text style={styles.creatorName}>{list.creator}</Text>
                <Text style={styles.creatorMeta}>{list.handle}</Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>{list.description}</Text>
            {privateList ? (
              <View style={styles.privateBadge}>
                <Icon name="lock" color={colors.accent} size={14} strokeWidth={2.1} />
                <Text style={styles.privateBadgeText}>lista privada: somente voce ve esta lista</Text>
              </View>
            ) : null}
            <Text style={styles.listMeta}>{list.booksCount} livros - {list.saves} salvos - {list.updatedAt}</Text>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onToggleSave?.(list.id);
                  setMenuNotice(saved ? "Lista removida dos salvos." : "Lista salva.");
                }}
                style={[styles.actionButton, saved ? styles.savedAction : styles.primaryAction]}
              >
                <Icon name="bookmark" color={saved ? colors.text : colors.ink} size={17} strokeWidth={2.2} />
                <Text style={saved ? styles.actionText : styles.primaryActionText}>
                  {saved ? "Lista salva" : "Salvar lista"}
                </Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => handleMenuAction("Compartilhar")} style={styles.actionButton}>
                <Icon name="share" color={colors.text} size={17} strokeWidth={2.1} />
                <Text style={styles.actionText}>Compartilhar</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            {list.ordered ? (
              <View style={styles.bookList}>
                {books.map((book, index) => (
                  <RankedBook
                    key={`${list.id}-${book.id}`}
                    book={book}
                    rank={index + 1}
                    onBookOpen={onBookOpen}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.bookGrid}>
                {books.map((book) => (
                  <Pressable
                    accessibilityRole="button"
                    key={`${list.id}-${book.id}`}
                    onPress={() => onBookOpen?.(book.id)}
                    style={styles.gridBook}
                  >
                    <BookCover book={book} size="grid" />
                    <Text style={styles.gridBookTitle} numberOfLines={2}>{book.title}</Text>
                    <Text style={styles.gridBookAuthor} numberOfLines={1}>{book.author}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

        </ScrollView>

        <BottomNav activeTab="lists" onChange={onNavigate} onCreate={onCreate} />
        <ListMenu
          owner={owner}
          privateList={privateList}
          visible={menuVisible}
          onAction={handleMenuAction}
          onClose={() => setMenuVisible(false)}
        />
        <TextFeedbackSheet
          visible={reportOpen}
          title="Denunciar lista"
          description="Explique o problema encontrado nesta lista."
          placeholder="Descreva o motivo da denuncia..."
          submitLabel="Registrar"
          onClose={() => setReportOpen(false)}
          onSubmit={() => {
            setReportOpen(false);
            setMenuNotice("Denuncia registrada.");
          }}
        />
        {menuNotice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{menuNotice}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function ListMenu({ owner, privateList, visible, onAction, onClose }) {
  const ownerActions = owner
    ? ["Editar lista", privateList ? "Tornar publica" : "Tornar privada", "Apagar lista"]
    : [];
  const actions = [...ownerActions, "Compartilhar", "Copiar link", ...(!owner ? ["Denunciar lista"] : [])];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.menuOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.menuSheet}>
          <View style={styles.menuHandle} />
          <Text style={styles.menuTitle}>Opcoes da lista</Text>
          <View style={styles.menuActions}>
            {actions.map((action) => (
              <Pressable
                accessibilityRole="button"
                key={action}
                onPress={() => onAction?.(action)}
                style={styles.menuAction}
              >
                <Text style={[styles.menuActionText, action === "Apagar lista" && styles.menuActionDanger]}>
                  {action}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function RankedBook({ book, rank, onBookOpen }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onBookOpen?.(book.id)} style={styles.bookRow}>
      <Text style={styles.rank}>{rank}</Text>
      <BookCover book={book} size="small" />
      <View style={styles.bookCopy}>
        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
      </View>
    </Pressable>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
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
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.025)"
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
    marginBottom: spacing.lg
  },
  heroKicker: {
    ...type.label,
    color: colors.warm,
    textTransform: "uppercase",
    marginBottom: spacing.sm
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 29,
    lineHeight: 31
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  avatarText: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 12
  },
  creatorCopy: {
    flex: 1,
    minWidth: 0
  },
  creatorName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15
  },
  creatorMeta: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1
  },
  description: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  listMeta: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.sm
  },
  privateBadge: {
    alignSelf: "flex-start",
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)"
  },
  privateBadgeText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  actionButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)",
    backgroundColor: colors.accentWash
  },
  primaryAction: {
    backgroundColor: colors.accent,
    borderColor: colors.transparent
  },
  savedAction: {
    backgroundColor: "rgba(255,255,255,0.055)",
    borderColor: "rgba(240,236,228,0.12)"
  },
  actionText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  primaryActionText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  section: {
    marginBottom: spacing.lg
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
  bookList: {
    marginHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  bookRow: {
    minHeight: 78,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  rank: {
    width: 24,
    color: colors.textMuted,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center"
  },
  bookCopy: {
    flex: 1,
    minWidth: 0
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 18
  },
  bookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3
  },
  bookGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18
  },
  gridBook: {
    width: "31%"
  },
  gridBookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 15,
    marginTop: 9
  },
  gridBookAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  menuOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  menuSheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderRadius: 28,
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.58,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 40,
    elevation: 24
  },
  menuHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  menuTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27,
    marginBottom: spacing.md
  },
  menuActions: {
    gap: spacing.sm
  },
  menuAction: {
    minHeight: 48,
    borderRadius: 17,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.035)"
  },
  menuActionText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14
  },
  menuActionDanger: {
    color: "#d96060"
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
