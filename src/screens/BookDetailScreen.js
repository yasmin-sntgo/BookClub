import { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { SpoilerText } from "../components/SpoilerText";
import { TextFeedbackSheet } from "../components/TextFeedbackSheet";
import { getBooks, getComments, getReviews, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const mockBooks = getBooks();
const mockComments = getComments();
const mockReviews = getReviews();
const mockUsers = getUsers();

const shelfOptions = ["Lendo", "Quero ler", "Lido", "Abandonado"];
const moreOptions = ["Compartilhar livro", "Copiar link", "Sugerir correcao", "Denunciar problema"];
const shelfStatusLabels = {
  reading: "Lendo",
  want: "Quero ler",
  read: "Lido",
  abandoned: "Abandonado"
};

function waitForSheetClose() {
  return new Promise((resolve) => setTimeout(resolve, 180));
}

export function BookDetailScreen({
  bookId = "dune",
  comments = mockComments,
  likedReviewIds = [],
  revealedSpoilerReviewIds = [],
  ratings = [],
  reviews = mockReviews,
  shelfEntry,
  onBack,
  onAddToShelf,
  onBookOpen,
  onCreate,
  onCreateReview,
  onNavigate,
  onRateBook,
  onRatingDelete,
  onRatingsOpen,
  onReviewOpen,
  onReviewsOpen,
  onShelfStatusChange,
  onSpoilerReveal,
  onToggleFavorite,
  onUserOpen
}) {
  const [synopsisOpen, setSynopsisOpen] = useState(false);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(null);
  const [notice, setNotice] = useState("");
  const [similarLimit, setSimilarLimit] = useState(4);
  const book = mockBooks.find((item) => item.id === bookId) ?? mockBooks[1];
  const review = useMemo(
    () => reviews.find((item) => item.bookId === book.id),
    [book.id, reviews]
  );
  const userRating = ratings.find((item) => item.bookId === book.id);
  const allSimilarBooks = mockBooks.filter((item) => item.id !== book.id);
  const similarBooks = allSimilarBooks.slice(0, similarLimit);

  useEffect(() => {
    setSimilarLimit(4);
  }, [book.id]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timeout);
  }, [notice]);

  async function shareBook() {
    await waitForSheetClose();
    const bookLink = `bookclub://livros/${book.id}`;

    setNotice("Abrindo compartilhamento...");
    try {
      const result = await Share.share({
        message: `${book.title} - ${book.author}\n${bookLink}`
      });

      if (result?.action === Share.dismissedAction) {
        setNotice("Compartilhamento cancelado.");
        return;
      }

      setNotice("Livro pronto para compartilhar.");
    } catch (error) {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(bookLink);
        setNotice("Compartilhamento indisponivel. Link copiado.");
        return;
      }

      setNotice(`Link do livro: ${bookLink}`);
    }
  }

  async function copyBookLink() {
    const bookLink = `bookclub://livros/${book.id}`;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(bookLink);
      setNotice("Link do livro copiado.");
      return;
    }

    setNotice(`Link do livro: ${bookLink}`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Hero
            book={book}
            onBack={onBack}
            onMore={() => setMoreOpen(true)}
            onCreateReview={() => onCreateReview?.(book.id)}
            onRateBook={() => onRateBook?.(book.id)}
            onShelf={() => setShelfOpen(true)}
            onToggleFavorite={() => {
              onToggleFavorite?.(book.id);
              setNotice(shelfEntry?.favorite ? "Livro removido dos favoritos." : "Livro marcado como favorito.");
            }}
            shelfEntry={shelfEntry}
            userRating={userRating}
          />

          <View style={styles.body}>
            <SectionHeader title="Sinopse" />
            <Pressable
              accessibilityRole="button"
              onPress={() => setSynopsisOpen((current) => !current)}
              style={[styles.synopsisBlock, synopsisOpen && styles.synopsisOpen]}
            >
              <Text style={styles.synopsisText} numberOfLines={synopsisOpen ? undefined : 4}>
                {book.synopsis ??
                  "Uma leitura marcante que mistura personagens memoraveis, conflitos intensos e um universo que convida o leitor a continuar pensando depois da ultima pagina."}
              </Text>
              {!synopsisOpen ? (
                <LinearGradient
                  colors={["rgba(18,18,18,0)", "rgba(18,18,18,0.98)"]}
                  style={styles.synopsisFade}
                />
              ) : null}
            </Pressable>

            <SectionHeader title="Avaliacoes" action="Ver todas" onAction={() => onRatingsOpen?.(book.id)} />
            <View style={styles.ratingSummary}>
              <View style={styles.communityRating}>
                <Text style={styles.ratingSummaryScore}>{book.rating}</Text>
                <View style={styles.ratingSummaryCopy}>
                  <RatingStars rating={book.rating} size={15} />
                  <Text style={styles.ratingSummaryText}>{book.ratingsCount} avaliacoes da comunidade</Text>
                </View>
              </View>
              {userRating ? (
                <View style={styles.personalRatingInline}>
                  <Text style={styles.personalRatingInlineText}>sua nota {userRating.rating}.0</Text>
                  <Pressable accessibilityRole="button" onPress={() => onRatingDelete?.(book.id)} hitSlop={8}>
                    <Text style={styles.deleteRatingText}>apagar</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            <SectionHeader
              title="Vozes sobre o livro"
              action={review ? "Todas" : undefined}
              onAction={review ? () => onReviewsOpen?.(book.id) : undefined}
            />
            {review ? (
              <ReviewCard
                review={review}
                commentCount={countReviewComments(review, comments)}
                liked={likedReviewIds.includes(review.id)}
                spoilerRevealed={revealedSpoilerReviewIds.includes(review.id)}
                onReviewOpen={onReviewOpen}
                onSpoilerReveal={() => onSpoilerReveal?.(review.id)}
                onUserOpen={onUserOpen}
              />
            ) : (
              <View style={styles.emptyReviewCard}>
                <Text style={styles.emptyReviewTitle}>Ainda nao tem vozes por aqui</Text>
                <Text style={styles.emptyReviewText}>Seja a primeira pessoa a puxar conversa sobre este livro.</Text>
              </View>
            )}

            <SectionHeader
              title="Semelhantes"
              action={similarLimit < allSimilarBooks.length ? "Ver mais" : undefined}
              onAction={() => setSimilarLimit((current) => Math.min(current + 4, allSimilarBooks.length))}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRail}>
              {similarBooks.map((item) => (
                <Pressable key={item.id} onPress={() => onBookOpen?.(item.id)} style={styles.similarItem}>
                  <BookCover book={item} size="medium" />
                  <Text style={styles.similarTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.similarAuthor} numberOfLines={1}>{item.author}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
        <OptionSheet
          visible={shelfOpen}
          title="Adicionar a estante"
          subtitle="Escolha como este livro entra na sua biblioteca."
          options={shelfOptions}
          onSelect={(option) => {
            onShelfStatusChange?.(book.id, option);
            setNotice(`Livro marcado como ${option.toLowerCase()}.`);
          }}
          onClose={() => setShelfOpen(false)}
        />
        <OptionSheet
          visible={moreOpen}
          title="Mais opcoes"
          subtitle="Acoes secundarias deste livro."
          options={moreOptions}
          onSelect={async (option) => {
            if (option === "Compartilhar livro") {
              await shareBook();
              return;
            }

            if (option === "Copiar link") {
              await copyBookLink();
              return;
            }

            if (option === "Sugerir correcao") {
              setFeedbackMode("correction");
              return;
            }

            if (option === "Denunciar problema") {
              setFeedbackMode("report");
            }
          }}
          onClose={() => setMoreOpen(false)}
        />
        <TextFeedbackSheet
          visible={Boolean(feedbackMode)}
          title={feedbackMode === "correction" ? "Sugerir correcao" : "Denunciar problema"}
          description={
            feedbackMode === "correction"
              ? "Explique qual informacao do livro precisa ser corrigida."
              : "Descreva o problema para que ele possa ser analisado."
          }
          placeholder={
            feedbackMode === "correction"
              ? "Ex: editora incorreta, ano errado, sinopse com erro..."
              : "Explique o que esta errado ou inadequado..."
          }
          submitLabel="Registrar"
          onClose={() => setFeedbackMode(null)}
          onSubmit={() => {
            setFeedbackMode(null);
            setNotice(feedbackMode === "correction" ? "Sugestao registrada." : "Denuncia registrada.");
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

function Hero({ book, shelfEntry, userRating, onBack, onCreateReview, onMore, onRateBook, onShelf, onToggleFavorite }) {
  const longTitle = book.title.length > 12;
  const veryLongTitle = book.title.length > 22;
  const shelfLabel = shelfEntry ? shelfStatusLabels[shelfEntry.status] ?? "Na estante" : "Estante";
  const ratingLabel = userRating ? `${userRating.rating}.0` : "Avaliar";

  return (
    <View style={[styles.hero, veryLongTitle && styles.heroTall]}>
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.heroShade}
      />

      <View style={styles.heroTop}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.heroButton}>
          <Icon name="back" color={colors.text} size={24} strokeWidth={2.4} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onMore} style={styles.heroButton}>
          <Icon name="more" color={colors.text} size={24} />
        </Pressable>
      </View>

      <View style={styles.bookMain}>
        <View style={styles.largeCoverWrap}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} resizeMode="cover" style={styles.largeCover} />
          ) : (
            <BookCover book={book} size="large" showTitle />
          )}
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.genreLabel}>genero - {book.genre}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            numberOfLines={3}
            style={[
              styles.bookName,
              longTitle && styles.bookNameLong,
              veryLongTitle && styles.bookNameVeryLong
            ]}
          >
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          <View style={styles.metaPills}>
            <Text style={styles.metaPill}>{book.year}</Text>
            <Text style={styles.metaPill}>{book.pages} paginas</Text>
            <Text style={styles.metaPill}>{book.publisher}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <BookAction icon="books" label={shelfLabel} featured={Boolean(shelfEntry)} onPress={onShelf} />
        <BookAction icon={userRating ? "star" : "starOutline"} label={ratingLabel} active={Boolean(userRating)} onPress={onRateBook} />
        <BookAction icon="comment" label="Resenha" onPress={onCreateReview} />
        <BookAction icon="heart" label="Favorito" active={Boolean(shelfEntry?.favorite)} onPress={onToggleFavorite} />
      </View>
    </View>
  );
}

function BookAction({ icon, label, featured = false, active = false, onPress }) {
  const activeColor = icon === "heart" ? "#d96060" : colors.warm;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.bookAction,
        featured && styles.featuredAction,
        active && icon === "heart" && styles.favoriteBookAction,
        active && icon !== "heart" && styles.activeBookAction
      ]}
    >
      <Icon
        name={icon}
        color={active ? activeColor : colors.text}
        fill={active && icon === "heart" ? activeColor : "none"}
        size={24}
        strokeWidth={2}
      />
      <Text style={[styles.bookActionText, active && { color: activeColor }]}>{label}</Text>
    </Pressable>
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

function ReviewCard({ review, commentCount, liked, spoilerRevealed, onReviewOpen, onSpoilerReveal, onUserOpen }) {
  const userId = mockUsers.find((user) => user.handle === review.handle)?.id ?? "lia";
  const likeCount = getReviewLikeCount(review, liked);

  return (
    <Pressable onPress={() => onReviewOpen?.(review.id, "book")} style={styles.reviewCard}>
      <Pressable
        onPress={(event) => {
          event.stopPropagation?.();
          onUserOpen?.(userId);
        }}
        style={styles.reviewTop}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.avatar}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <Text style={styles.reviewHandle}>{review.handle} - {review.time}</Text>
        </View>
      </Pressable>
      <RatingStars rating={review.rating} size={14} />
      <SpoilerText
        hasSpoiler={review.hasSpoiler}
        onReveal={onSpoilerReveal}
        revealed={spoilerRevealed}
        text={review.text}
        style={styles.reviewText}
        numberOfLines={4}
      />
      <View style={styles.reviewActions}>
        <Text style={styles.reviewAction}>{likeCount} curtidas</Text>
        <Text style={styles.reviewAction}>{commentCount} respostas</Text>
      </View>
    </Pressable>
  );
}

function countReviewComments(review, comments) {
  return comments.filter((comment) => comment.reviewId === review.id).length || review.comments;
}

function getReviewLikeCount(review, liked) {
  return review.likes + (liked && !review.liked ? 1 : 0) - (!liked && review.liked ? 1 : 0);
}

function OptionSheet({ visible, title, subtitle, options, onSelect, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.optionSheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>{title}</Text>
          <Text style={styles.sheetSubtitle}>{subtitle}</Text>
          <View style={styles.optionList}>
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onClose?.();
                  setTimeout(() => onSelect?.(option), 120);
                }}
                style={styles.optionRow}
              >
                <Text style={styles.optionText}>{option}</Text>
                <Icon name="chevron" color={colors.textMuted} size={20} />
              </Pressable>
            ))}
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
  content: {
    paddingBottom: 118
  },
  hero: {
    minHeight: 438,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    overflow: "hidden",
    backgroundColor: colors.background
  },
  heroTall: {
    minHeight: 458
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26
  },
  heroButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,10,10,0.58)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)"
  },
  bookMain: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 18
  },
  largeCoverWrap: {
    width: 148,
    height: 222,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.58,
    shadowOffset: { width: 0, height: 22 },
    shadowRadius: 40,
    elevation: 14
  },
  largeCover: {
    width: "100%",
    height: "100%"
  },
  bookInfo: {
    flex: 1,
    minWidth: 0
  },
  genreLabel: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase",
    marginBottom: 7
  },
  bookName: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 32
  },
  bookNameLong: {
    fontSize: 25,
    lineHeight: 26
  },
  bookNameVeryLong: {
    fontSize: 21,
    lineHeight: 23
  },
  author: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19,
    marginTop: spacing.xs,
    marginBottom: 11
  },
  metaPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: spacing.md
  },
  metaPill: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)",
    overflow: "hidden"
  },
  actionGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18
  },
  bookAction: {
    flex: 1,
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.052)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.1)"
  },
  featuredAction: {
    backgroundColor: "rgba(157,192,216,0.16)",
    borderColor: "rgba(157,192,216,0.24)"
  },
  activeBookAction: {
    backgroundColor: "rgba(196,145,74,0.12)",
    borderColor: "rgba(196,145,74,0.28)"
  },
  favoriteBookAction: {
    backgroundColor: "rgba(217,96,96,0.1)",
    borderColor: "rgba(217,96,96,0.22)"
  },
  bookActionText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12
  },
  body: {
    paddingTop: spacing.md
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24
  },
  sectionAction: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  synopsisBlock: {
    minHeight: 104,
    maxHeight: 116,
    marginHorizontal: spacing.lg,
    marginBottom: 28,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: "hidden"
  },
  synopsisOpen: {
    maxHeight: 260
  },
  synopsisText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21
  },
  synopsisFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 58
  },
  ratingSummary: {
    marginHorizontal: spacing.lg,
    marginBottom: 30,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  communityRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  ratingSummaryScore: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 44
  },
  ratingSummaryCopy: {
    gap: 4
  },
  ratingSummaryText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15
  },
  personalRatingInline: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(157,192,216,0.11)",
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  personalRatingInlineText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15
  },
  deleteRatingText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16
  },
  reviewCard: {
    marginHorizontal: spacing.lg,
    marginBottom: 30,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(157,192,216,0.52)"
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.textSoft,
    fontFamily: fonts.display,
    fontSize: 15
  },
  userInfo: {
    flex: 1,
    minWidth: 0
  },
  reviewUser: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  reviewHandle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15
  },
  reviewText: {
    color: colors.textSoft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm
  },
  reviewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md
  },
  reviewAction: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  emptyReviewCard: {
    marginHorizontal: spacing.lg,
    marginBottom: 30,
    minHeight: 118,
    padding: spacing.md,
    borderRadius: 18,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.028)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyReviewTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  emptyReviewText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  },
  similarRail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl
  },
  similarItem: {
    width: 112
  },
  similarTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 15,
    marginTop: 9
  },
  similarAuthor: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  optionSheet: {
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
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29
  },
  sheetSubtitle: {
    ...type.small,
    color: colors.textMuted,
    marginTop: 3,
    marginBottom: spacing.lg
  },
  optionList: {
    gap: spacing.sm
  },
  optionRow: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  optionText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14
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
