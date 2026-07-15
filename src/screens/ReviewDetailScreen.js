import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Animated,
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

import { AppToast } from "../components/AppToast";
import { BookCover } from "../components/BookCover";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { RatingStars } from "../components/RatingStars";
import { SpoilerText } from "../components/SpoilerText";
import { TextFeedbackSheet } from "../components/TextFeedbackSheet";
import { getBooks, getComments, getReviews, getUsers } from "../services";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

const mockBooks = getBooks();
const mockComments = getComments();
const mockReviews = getReviews();
const mockUsers = getUsers();

export function ReviewDetailScreen({
  reviewId = "review-1",
  comments: availableComments = mockComments,
  currentUserHandle = "@yasmin_le",
  likedCommentIds = [],
  likedReviewIds = [],
  saved = false,
  reviews = mockReviews,
  users = mockUsers,
  onBack,
  onBookOpen,
  onCommentCreate,
  onCommentDelete,
  onCommentEdit,
  onCreate,
  onNavigate,
  onReviewDelete,
  onReviewEdit,
  onSpoilerReveal,
  onToggleCommentLike,
  onToggleReviewLike,
  onToggleSave,
  onUserOpen,
  revealedSpoilerReviewIds = []
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const commentInputRef = useRef(null);
  const saveScale = useRef(new Animated.Value(1)).current;
  const review = reviews.find((item) => item.id === reviewId) ?? reviews[0] ?? mockReviews[0];
  const book = mockBooks.find((item) => item.id === review.bookId) ?? mockBooks[0];
  const comments = useMemo(
    () => availableComments.filter((comment) => comment.reviewId === review.id),
    [availableComments, review.id]
  );
  const likedByMe = likedReviewIds.includes(review.id);
  const isOwnReview = review.local || review.handle === currentUserHandle;
  const reviewLikeCount = review.likes + (likedByMe && !review.liked ? 1 : 0) - (!likedByMe && review.liked ? 1 : 0);

  function focusComposer() {
    setTimeout(() => commentInputRef.current?.focus(), 80);
  }

  function startReply(userName) {
    setReplyingTo(userName);
    focusComposer();
  }

  function sendComment() {
    const text = commentText.trim();

    if (!text) {
      return;
    }

    onCommentCreate?.({ reviewId: review.id, text, replyingTo });
    setCommentText("");
    setReplyingTo(null);
    setNotice("Comentário publicado.");
    commentInputRef.current?.blur();
    Keyboard.dismiss();
  }

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

  async function copyReviewLink() {
    const reviewLink = `bookclub://resenhas/${review.id}`;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(reviewLink);
      setNotice("Link da resenha copiado.");
      return;
    }

    setNotice(`Link da resenha: ${reviewLink}`);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timeout);
  }, [notice]);

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
            <AuthorLine review={review} onUserOpen={onUserOpen} users={users} />

            <Pressable onPress={() => onBookOpen?.(book.id)} style={styles.bookBlock}>
              <BookCover book={book} size="small" />
              <View style={styles.bookCopy}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <RatingStars rating={review.rating} size={15} />
              </View>
            </Pressable>

            <SpoilerText
              hasSpoiler={review.hasSpoiler}
              onReveal={() => onSpoilerReveal?.(review.id)}
              revealed={revealedSpoilerReviewIds.includes(review.id)}
              text={review.text}
              style={styles.reviewText}
            />
            <Text style={styles.metaLine}>{review.postedAt} - {review.views} visualizacoes</Text>

            <View style={styles.actions}>
              <ActionIcon
                icon="heart"
                count={reviewLikeCount}
                active={likedByMe}
                activeColor="#d96060"
                onPress={() => onToggleReviewLike?.(review.id)}
              />
              <ActionIcon icon="comment" count={comments.length} onPress={focusComposer} />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  saveScale.setValue(0.88);
                  Animated.spring(saveScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 26,
                    bounciness: 7
                  }).start();
                  onToggleSave?.(review.id);
                  setNotice(saved ? "Resenha removida dos salvos." : "Resenha salva.");
                }}
                style={styles.action}
              >
                <Animated.View style={{ transform: [{ scale: saveScale }] }}>
                  <Icon
                    name="bookmark"
                    color={saved ? colors.accent : colors.textMuted}
                    fill={saved ? colors.accent : "none"}
                    size={19}
                    strokeWidth={2}
                  />
                </Animated.View>
                <Text style={[styles.actionText, saved && { color: colors.accent }]}>
                  {saved ? "salva" : "salvar"}
                </Text>
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
            <Text style={styles.sectionTitle}>Comentários</Text>
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
                  onMenu={() => setSelectedComment(comment)}
                  onReply={() => startReply(comment.user)}
                  onUserOpen={onUserOpen}
                  users={users}
                />
              );
            })}
          </View>
        </ScrollView>

        <CommentComposer
          inputRef={commentInputRef}
          keyboardVisible={keyboardVisible}
          text={commentText}
          replyingTo={replyingTo}
          onCancel={() => setReplyingTo(null)}
          onChangeText={setCommentText}
          onSend={sendComment}
        />
        {keyboardVisible ? null : <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />}
        <ActionSheet
          visible={menuVisible}
          title="Opções da resenha"
          options={[
            ...(isOwnReview ? ["Editar resenha", "Apagar resenha"] : []),
            saved ? "Remover dos salvos" : "Salvar resenha",
            "Compartilhar resenha",
            "Copiar link",
            ...(!isOwnReview ? ["Denunciar resenha"] : [])
          ]}
          onClose={() => setMenuVisible(false)}
          onSelect={(option) => {
            setMenuVisible(false);
            if (option === "Editar resenha") {
              setEditTarget({ type: "review", id: review.id, text: review.text });
              return;
            }
            if (option === "Apagar resenha") {
              onReviewDelete?.(review.id);
              return;
            }
            if (option === "Salvar resenha" || option === "Remover dos salvos") {
              onToggleSave?.(review.id);
              setNotice(saved ? "Resenha removida dos salvos." : "Resenha salva.");
              return;
            }
            if (option === "Compartilhar resenha") {
              shareReview();
              return;
            }
            if (option === "Copiar link") {
              copyReviewLink();
              return;
            }
            setReportTarget({ type: "review", id: review.id });
          }}
        />
        <ActionSheet
          visible={Boolean(selectedComment)}
          title="Opções do comentário"
          options={
            selectedComment?.handle === currentUserHandle
            || selectedComment?.local
              ? ["Editar comentário", "Apagar comentário", "Denunciar comentário"]
              : ["Denunciar comentário"]
          }
          onClose={() => setSelectedComment(null)}
          onSelect={(option) => {
            const commentId = selectedComment?.id;

            setSelectedComment(null);
            if (option === "Editar comentário" && commentId) {
              setEditTarget({ type: "comment", id: commentId, text: selectedComment?.text ?? "" });
              return;
            }

            if (option === "Apagar comentário" && commentId) {
              onCommentDelete?.(commentId);
              setNotice("Comentário apagado.");
              return;
            }

            setReportTarget({ type: "comment", id: commentId });
          }}
        />
        <TextFeedbackSheet
          visible={Boolean(editTarget)}
          title={editTarget?.type === "comment" ? "Editar comentário" : "Editar resenha"}
          description={editTarget?.type === "comment" ? "Ajuste o texto do seu comentário." : "Ajuste o texto da sua resenha."}
          initialText={editTarget?.text ?? ""}
          placeholder={editTarget?.type === "comment" ? "Escreva o comentário..." : "Escreva a resenha..."}
          submitLabel="Salvar"
          onClose={() => setEditTarget(null)}
          onSubmit={(text) => {
            if (editTarget?.type === "comment") {
              onCommentEdit?.(editTarget.id, text);
              setNotice("Comentário editado.");
            } else if (editTarget?.type === "review") {
              onReviewEdit?.(editTarget.id, text);
              setNotice("Resenha editada.");
            }
            setEditTarget(null);
          }}
        />
        <TextFeedbackSheet
          visible={Boolean(reportTarget)}
          title={reportTarget?.type === "comment" ? "Denunciar comentário" : "Denunciar resenha"}
          description="Explique o motivo da denúncia para análise."
          placeholder="Descreva o problema..."
          submitLabel="Registrar"
          onClose={() => setReportTarget(null)}
          onSubmit={() => {
            setReportTarget(null);
            setNotice("Denúncia registrada.");
          }}
        />
        <AppToast message={notice} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthorLine({ review, onUserOpen, users = mockUsers }) {
  const userId = findUserId(review.handle, users);

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

function CommentCard({ comment, liked, likes, onLike, onMenu, onReply, onUserOpen, users = mockUsers }) {
  const userId = findUserId(comment.handle, users);
  const likeScale = useRef(new Animated.Value(1)).current;

  function handleLike(event) {
    event.stopPropagation?.();
    likeScale.setValue(0.88);
    Animated.spring(likeScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 26,
      bounciness: 7
    }).start();
    onLike?.();
  }

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
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation?.();
            onMenu?.();
          }}
          style={styles.commentMenu}
        >
          <Icon name="more" color={colors.textMuted} size={18} />
        </Pressable>
      </Pressable>
      <Text style={styles.commentText}>{comment.text}</Text>
      <View style={styles.commentActions}>
        <Pressable
          accessibilityRole="button"
          onPress={handleLike}
          style={styles.commentLike}
        >
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Icon
              name="heart"
              color={liked ? "#d96060" : colors.textMuted}
              fill={liked ? "#d96060" : "none"}
              size={16}
            />
          </Animated.View>
          <Text style={[styles.commentLikeText, !liked && styles.commentLikeMuted]}>
            {likes}
          </Text>
        </Pressable>
        <Pressable
          onPress={(event) => {
            event.stopPropagation?.();
            onReply?.();
          }}
        >
          <Text style={styles.replyText}>responder</Text>
        </Pressable>
      </View>
    </View>
  );
}

function findUserId(handle, users = mockUsers) {
  return users.find((user) => user.handle === handle)?.id ?? "lia";
}

function ActionIcon({ icon, count, active = false, activeColor = colors.accent, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = active ? activeColor : colors.textMuted;

  function handlePress(event) {
    event.stopPropagation?.();
    if (!onPress) {
      return;
    }

    scale.setValue(0.88);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 26,
      bounciness: 7
    }).start();
    onPress();
  }

  return (
    <Pressable accessibilityRole="button" onPress={handlePress} style={styles.action}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name={icon}
          color={color}
          size={20}
          fill={active && icon === "heart" ? activeColor : "none"}
        />
      </Animated.View>
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

function CommentComposer({ inputRef, keyboardVisible, replyingTo, text, onCancel, onChangeText, onSend }) {
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
          ref={inputRef}
          multiline
          placeholder={replyingTo ? "Escreva uma resposta..." : "Escreva um comentário..."}
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={onChangeText}
          style={styles.composerInput}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!text.trim()}
          onPress={onSend}
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
        >
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
  sendButtonDisabled: {
    opacity: 0.42
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
