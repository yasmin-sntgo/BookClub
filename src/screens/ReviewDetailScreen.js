import { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { mockBooks, mockComments, mockReviews, mockUsers } from "../data/mockFeed";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function ReviewDetailScreen({
  reviewId = "review-1",
  likedCommentIds = [],
  likedReviewIds = [],
  saved = false,
  reviews = mockReviews,
  onBack,
  onBookOpen,
  onCreate,
  onNavigate,
  onToggleCommentLike,
  onToggleReviewLike,
  onToggleSave,
  onUserOpen
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState(false);
  const [notice, setNotice] = useState("");
  const review = reviews.find((item) => item.id === reviewId) ?? reviews[0] ?? mockReviews[0];
  const book = mockBooks.find((item) => item.id === review.bookId) ?? mockBooks[0];
  const comments = useMemo(
    () => mockComments.filter((comment) => comment.reviewId === review.id),
    [review.id]
  );
  const likedByMe = likedReviewIds.includes(review.id);
  const reviewLikeCount = review.likes + (likedByMe && !review.liked ? 1 : 0) - (!likedByMe && review.liked ? 1 : 0);

  async function shareReview() {
    setNotice("Abrindo compartilhamento...");
    try {
      const result = await Share.share({
        message: `${review.user} resenhou ${book.title} no BookClub: ${review.text}\nbookclub://resenhas/${review.id}`
      });

      if (result?.action === Share.dismissedAction) {
        setNotice("Compartilhamento cancelado.");
        return;
      }

      setNotice("Resenha pronta para compartilhar.");
    } catch (error) {
      setNotice(`Resenha: bookclub://resenhas/${review.id}`);
    }
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        style={styles.shell}
      >
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.title}>Resenha</Text>
          <Pressable accessibilityRole="button" onPress={() => setMenuVisible(true)} style={styles.headerButton}>
            <Icon name="more" color={colors.textSoft} size={22} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.reviewCard}>
            <AuthorLine review={review} onUserOpen={onUserOpen} />

            <Pressable onPress={() => onBookOpen?.(book.id)} style={styles.bookBlock}>
              <BookCover book={book} size="small" />
              <View style={styles.bookCopy}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <RatingStars rating={review.rating} size={15} />
              </View>
            </Pressable>

            <Text style={styles.reviewText}>{review.text}</Text>
            <Text style={styles.metaLine}>{review.postedAt} - {review.views} visualizacoes</Text>

            <View style={styles.actions}>
              <ActionIcon
                icon="heart"
                count={reviewLikeCount}
                active={likedByMe}
                activeColor="#d96060"
                onPress={() => onToggleReviewLike?.(review.id)}
              />
              <ActionIcon icon="comment" count={review.comments} />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onToggleSave?.(review.id);
                  setNotice(saved ? "Resenha removida dos salvos." : "Resenha salva.");
                }}
                style={styles.action}
              >
                <Icon
                  name="bookmark"
                  color={saved ? colors.accent : colors.textMuted}
                  fill={saved ? colors.accent : "none"}
                  size={19}
                  strokeWidth={2}
                />
                <Text style={[styles.actionText, saved && { color: colors.accent }]}>salvar</Text>
              </Pressable>
              <View style={styles.actionSpacer} />
              <Pressable
                accessibilityRole="button"
                onPress={shareReview}
              >
                <Text style={styles.shareText}>compartilhar</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
          </View>

          <View style={styles.comments}>
            {comments.map((comment) => {
              const liked = likedCommentIds.includes(comment.id);
              const likes =
                comment.likes
                + (liked && !comment.liked ? 1 : 0)
                - (!liked && comment.liked ? 1 : 0);

              return (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  liked={liked}
                  likes={likes}
                  onLike={() => onToggleCommentLike?.(comment.id)}
                  onMenu={() => setCommentMenuVisible(true)}
                  onReply={() => setReplyingTo(comment.user)}
                  onUserOpen={onUserOpen}
                />
              );
            })}
          </View>
        </ScrollView>

        <CommentComposer
          keyboardVisible={keyboardVisible}
          replyingTo={replyingTo}
          onCancel={() => setReplyingTo(null)}
        />
        {keyboardVisible ? null : <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />}
        <ActionSheet
          visible={menuVisible}
          title="Opcoes da resenha"
          options={[saved ? "Remover dos salvos" : "Salvar resenha", "Compartilhar resenha", "Denunciar resenha"]}
          onClose={() => setMenuVisible(false)}
          onSelect={(option) => {
            setMenuVisible(false);
            if (option === "Salvar resenha" || option === "Remover dos salvos") {
              onToggleSave?.(review.id);
              setNotice(saved ? "Resenha removida dos salvos." : "Resenha salva.");
              return;
            }
            if (option === "Compartilhar resenha") {
              shareReview();
              return;
            }
            setNotice("Denuncia registrada neste exemplo.");
          }}
        />
        <ActionSheet
          visible={commentMenuVisible}
          title="Opcoes do comentario"
          options={["Denunciar comentario"]}
          onClose={() => setCommentMenuVisible(false)}
          onSelect={() => {
            setCommentMenuVisible(false);
            setNotice("Denuncia do comentario registrada neste exemplo.");
          }}
        />
        {notice ? (
          <View style={styles.noticeToast}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthorLine({ review, onUserOpen }) {
  const userId = findUserId(review.handle);

  return (
    <Pressable onPress={() => onUserOpen?.(userId)} style={styles.authorLine}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{review.avatar}</Text>
      </View>
      <View style={styles.authorCopy}>
        <Text style={styles.authorName}>{review.user}</Text>
        <Text style={styles.authorHandle}>{review.handle} - {review.time}</Text>
      </View>
    </Pressable>
  );
}

function CommentCard({ comment, liked, likes, onLike, onMenu, onReply, onUserOpen }) {
  const userId = findUserId(comment.handle);

  return (
    <View style={styles.commentCard}>
      <Pressable onPress={() => onUserOpen?.(userId)} style={styles.commentTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{comment.avatar}</Text>
        </View>
        <View style={styles.authorCopy}>
          <Text style={styles.authorName}>{comment.user}</Text>
          <Text style={styles.authorHandle}>{comment.handle} - {comment.time}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onMenu} style={styles.commentMenu}>
          <Icon name="more" color={colors.textMuted} size={18} />
        </Pressable>
      </Pressable>
      <Text style={styles.commentText}>{comment.text}</Text>
      <View style={styles.commentActions}>
        <Pressable accessibilityRole="button" onPress={onLike} style={styles.commentLike}>
          <Icon
            name="heart"
            color={liked ? "#d96060" : colors.textMuted}
            fill={liked ? "#d96060" : "none"}
            size={16}
          />
          <Text style={[styles.commentLikeText, !liked && styles.commentLikeMuted]}>
            {likes}
          </Text>
        </Pressable>
        <Pressable onPress={onReply}>
          <Text style={styles.replyText}>responder</Text>
        </Pressable>
      </View>
    </View>
  );
}

function findUserId(handle) {
  return mockUsers.find((user) => user.handle === handle)?.id ?? "lia";
}

function ActionIcon({ icon, count, active = false, activeColor = colors.accent, onPress }) {
  const color = active ? activeColor : colors.textMuted;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.action}>
      <Icon
        name={icon}
        color={color}
        size={20}
        fill={active && icon === "heart" ? activeColor : "none"}
      />
      <Text style={[styles.actionText, active && { color }]}>{count}</Text>
    </Pressable>
  );
}

function ActionSheet({ visible, title, options, onClose, onSelect }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.optionSheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>{title}</Text>
          {options.map((option) => (
            <Pressable key={option} onPress={() => onSelect?.(option)} style={styles.optionRow}>
              <Text style={styles.optionText}>{option}</Text>
              <Icon name="chevron" color={colors.textMuted} size={20} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function CommentComposer({ keyboardVisible, replyingTo, onCancel }) {
  return (
    <View style={[styles.composerWrap, keyboardVisible && styles.composerWrapKeyboard]}>
      {replyingTo ? (
        <View style={styles.replyBanner}>
          <Text style={styles.replyBannerText}>Respondendo {replyingTo}</Text>
          <Pressable onPress={onCancel}>
            <Text style={styles.cancelReply}>cancelar</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.composer}>
        <TextInput
          multiline
          placeholder={replyingTo ? "Escreva uma resposta..." : "Escreva um comentario..."}
          placeholderTextColor={colors.textMuted}
          style={styles.composerInput}
        />
        <Pressable style={styles.sendButton}>
          <Icon name="send" color={colors.ink} size={19} strokeWidth={2.1} />
        </Pressable>
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
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg
  },
  reviewCard: {
    marginHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  authorLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: spacing.md
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.textSoft,
    fontFamily: fonts.display,
    fontSize: 13
  },
  authorCopy: {
    flex: 1,
    minWidth: 0
  },
  authorName: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16
  },
  authorHandle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1
  },
  bookBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md
  },
  bookCopy: {
    flex: 1,
    minWidth: 0
  },
  bookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 5
  },
  reviewText: {
    color: "#ded5c6",
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24
  },
  metaLine: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.md
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  actionText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 13
  },
  actionSpacer: {
    flex: 1
  },
  shareText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  comments: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  commentCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  commentTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: spacing.sm
  },
  commentMenu: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  commentText: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 43
  },
  commentActions: {
    marginLeft: 43,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg
  },
  commentLike: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  commentLikeText: {
    color: "#d96060",
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  commentLikeMuted: {
    color: colors.textMuted
  },
  replyText: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  composerWrap: {
    paddingHorizontal: 14,
    paddingTop: spacing.sm,
    paddingBottom: 88,
    backgroundColor: colors.background
  },
  composerWrapKeyboard: {
    paddingBottom: spacing.md
  },
  replyBanner: {
    minHeight: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.18)"
  },
  replyBannerText: {
    color: colors.textSoft,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  cancelReply: {
    color: colors.accent,
    fontFamily: fonts.bodyBold,
    fontSize: 12
  },
  composer: {
    minHeight: 52,
    borderRadius: 22,
    paddingLeft: spacing.md,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(22,22,22,0.96)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    elevation: 18
  },
  composerInput: {
    flex: 1,
    maxHeight: 92,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    paddingTop: 8,
    paddingBottom: 8,
    textAlignVertical: "center"
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
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
    backgroundColor: "rgba(22,22,22,0.98)",
    borderWidth: 1,
    borderColor: colors.border
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
    lineHeight: 29,
    marginBottom: spacing.md
  },
  optionRow: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
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
