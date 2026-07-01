import { useMemo, useState } from "react";
import { Image, Modal, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { mockBooks, mockComments, mockReviews, mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";

const ratingBars = [
  { label: "5", value: "86%" },
  { label: "4", value: "58%" },
  { label: "3", value: "27%" },
  { label: "2", value: "12%" },
  { label: "1", value: "6%" }
];

const shelfOptions = ["Lendo", "Quero ler", "Lido", "Abandonado"];
const moreOptions = ["Compartilhar livro", "Sugerir correcao", "Denunciar problema"];
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
  onRatingsOpen,
  onReviewOpen,
  onReviewsOpen,
  onSearchGenre,
  onShelfStatusChange,
  onToggleFavorite,
  onUserOpen
}) {
  const [synopsisOpen, setSynopsisOpen] = useState(false);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const book = mockBooks.find((item) => item.id === bookId) ?? mockBooks[1];
  const review = useMemo(
    () => reviews.find((item) => item.bookId === book.id),
    [book.id, reviews]
  );
  const userRating = ratings.find((item) => item.bookId === book.id);
  const similarBooks = mockBooks.filter((item) => item.id !== book.id).slice(0, 4);

  async function shareBook() {
    await waitForSheetClose();
    setNotice("Abrindo compartilhamento...");
    try {
      const result = await Share.share({
        message: `${book.title} - ${book.author}\nbookclub://livros/${book.id}`
      });

      if (result?.action === Share.dismissedAction) {
        setNotice("Compartilhamento cancelado.");
        return;
      }

      setNotice("Livro pronto para compartilhar.");
    } catch (error) {
      setNotice(`Livro: bookclub://livros/${book.id}`);
    }
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
            onToggleFavorite={() => onToggleFavorite?.(book.id)}
            shelfEntry={shelfEntry}
            userRating={userRating}
          />

          <View style={styles.body}>
            <SectionHeader title="Sinopse" />
            <Pressable
              accessibilityRole="button"
              onPress={() => setSynopsisOpen((current) => !current)}
              style={[styles.synopsisCard, synopsisOpen && styles.synopsisOpen]}
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
            <View style={[styles.scoreCard, !userRating && styles.scoreCardSpacing]}>
              <View style={styles.scoreBig}>
                <Text style={styles.scoreNumber}>{book.rating}</Text>
                <Text style={styles.scoreCaption}>{book.ratingsCount} avaliacoes</Text>
                {userRating ? <Text style={styles.userRatingText}>sua nota: {userRating.rating}.0</Text> : null}
              </View>
              <View style={styles.bars}>
                {ratingBars.map((bar) => (
                  <View key={bar.label} style={styles.barRow}>
                    <Text style={styles.barLabel}>{bar.label}</Text>
                    <View style={styles.barTrack}>
                      <LinearGradient
                        colors={[colors.accent, colors.warm]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.barFill, { width: bar.value }]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
            {userRating ? (
              <View style={styles.personalRatingCard}>
                <Text style={styles.personalRatingLabel}>Sua avaliacao</Text>
                <View style={styles.personalRatingScore}>
                  <Text style={styles.personalRatingNumber}>{userRating.rating}.0</Text>
                  <RatingStars rating={userRating.rating} size={13} />
                </View>
              </View>
            ) : null}

            <SectionHeader
              title="Resenhas"
              action={review ? "Todas" : undefined}
              onAction={review ? () => onReviewsOpen?.(book.id) : undefined}
            />
            {review ? (
              <ReviewCard
                review={review}
                commentCount={countReviewComments(review, comments)}
                onReviewOpen={onReviewOpen}
                onUserOpen={onUserOpen}
              />
            ) : (
              <View style={styles.emptyReviewCard}>
                <Text style={styles.emptyReviewTitle}>Ainda nao tem resenhas por aqui</Text>
                <Text style={styles.emptyReviewText}>se alguem escrever sobre este livro, a resenha aparece nesta area.</Text>
              </View>
            )}

            <SectionHeader title="Semelhantes" action="Ver mais" onAction={() => onSearchGenre?.(book.genre)} />
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

            if (option === "Sugerir correcao") {
              setNotice("Sugestao de correcao registrada neste exemplo.");
              return;
            }

            if (option === "Denunciar problema") {
              setNotice("Problema registrado neste exemplo.");
            }
          }}
          onClose={() => setMoreOpen(false)}
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
          <View style={styles.heroRating}>
            <Text style={styles.heroRatingNumber}>{book.rating}</Text>
            <RatingStars rating={book.rating} size={14} />
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

function ReviewCard({ review, commentCount, onReviewOpen, onUserOpen }) {
  const userId = mockUsers.find((user) => user.handle === review.handle)?.id ?? "lia";

  return (
    <Pressable onPress={() => onReviewOpen?.(review.id, "book")} style={styles.reviewCard}>
      <Pressable onPress={() => onUserOpen?.(userId)} style={styles.reviewTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.avatar}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <Text style={styles.reviewHandle}>{review.handle} - {review.time}</Text>
        </View>
      </Pressable>
      <RatingStars rating={review.rating} size={14} />
      <Text style={styles.reviewText} numberOfLines={4}>{review.text}</Text>
      <View style={styles.reviewActions}>
        <Text style={styles.reviewAction}>{review.likes} curtidas</Text>
        <Text style={styles.reviewAction}>{commentCount} respostas</Text>
        <Text style={styles.readMore}>ler mais</Text>
      </View>
    </Pressable>
  );
}

function countReviewComments(review, comments) {
  return comments.filter((comment) => comment.reviewId === review.id).length || review.comments;
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
    minHeight: 414,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    overflow: "hidden",
    backgroundColor: colors.background
  },
  heroTall: {
    minHeight: 438
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
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
    gap: 16
  },
  largeCoverWrap: {
    width: 140,
    height: 210,
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
    marginBottom: spacing.sm
  },
  bookName: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 31
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
    marginBottom: spacing.md
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
  heroRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  heroRatingNumber: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30
  },
  actionGrid: {
    flexDirection: "row",
    gap: 7,
    marginTop: 16
  },
  bookAction: {
    flex: 1,
    minHeight: 60,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
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
    paddingTop: spacing.lg
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
  synopsisCard: {
    minHeight: 112,
    maxHeight: 124,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border,
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
  scoreCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 24,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border
  },
  scoreCardSpacing: {
    marginBottom: spacing.xl
  },
  scoreBig: {
    width: 94,
    alignItems: "center",
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border
  },
  scoreNumber: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 42
  },
  scoreCaption: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 13,
    textAlign: "center",
    marginTop: spacing.xs
  },
  userRatingText: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    marginTop: spacing.sm
  },
  personalRatingCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  personalRatingLabel: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  personalRatingText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  personalRatingScore: {
    alignItems: "flex-end"
  },
  personalRatingNumber: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 2
  },
  bars: {
    flex: 1,
    gap: 7
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  barLabel: {
    width: 48,
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 10
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.07)"
  },
  barFill: {
    height: "100%",
    borderRadius: 4
  },
  reviewCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: colors.border
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md
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
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
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
  readMore: {
    marginLeft: "auto",
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  emptyReviewCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    minHeight: 118,
    padding: spacing.md,
    borderRadius: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
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
