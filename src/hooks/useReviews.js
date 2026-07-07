import { useMemo, useState } from "react";

import { getComments, getReviews } from "../services";

const baseComments = getComments();
const baseReviews = getReviews();

export function useReviews({ currentUserHandle = "@yasmin_le", profileOverride = null } = {}) {
  const [savedReviewIds, setSavedReviewIds] = useState([]);
  const [likedReviewIds, setLikedReviewIds] = useState(
    baseReviews.filter((review) => review.liked).map((review) => review.id)
  );
  const [likedCommentIds, setLikedCommentIds] = useState(
    baseComments.filter((comment) => comment.liked).map((comment) => comment.id)
  );
  const [createdReviews, setCreatedReviews] = useState([]);
  const [createdRatings, setCreatedRatings] = useState([]);
  const [createdComments, setCreatedComments] = useState([]);
  const [editedReviewTexts, setEditedReviewTexts] = useState({});
  const [editedCommentTexts, setEditedCommentTexts] = useState({});
  const [deletedReviewIds, setDeletedReviewIds] = useState([]);
  const [deletedCommentIds, setDeletedCommentIds] = useState([]);
  const [revealedSpoilerReviewIds, setRevealedSpoilerReviewIds] = useState([]);

  const allReviews = useMemo(
    () =>
      [...createdReviews, ...baseReviews]
        .filter((review) => !deletedReviewIds.includes(review.id))
        .map((review) =>
          editedReviewTexts[review.id]
            ? { ...review, text: editedReviewTexts[review.id], edited: true }
            : review
        ),
    [createdReviews, deletedReviewIds, editedReviewTexts]
  );

  const allComments = useMemo(
    () =>
      [...createdComments, ...baseComments]
        .filter((comment) => !deletedCommentIds.includes(comment.id) && !deletedReviewIds.includes(comment.reviewId))
        .map((comment) =>
          editedCommentTexts[comment.id]
            ? { ...comment, text: editedCommentTexts[comment.id], edited: true }
            : comment
        ),
    [createdComments, deletedCommentIds, deletedReviewIds, editedCommentTexts]
  );

  function toggleReviewSave(reviewId) {
    setSavedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((savedReviewId) => savedReviewId !== reviewId)
        : [...current, reviewId]
    );
  }

  function toggleReviewLike(reviewId) {
    setLikedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((likedReviewId) => likedReviewId !== reviewId)
        : [...current, reviewId]
    );
  }

  function toggleCommentLike(commentId) {
    setLikedCommentIds((current) =>
      current.includes(commentId)
        ? current.filter((likedCommentId) => likedCommentId !== commentId)
        : [...current, commentId]
    );
  }

  function revealSpoilerReview(reviewId) {
    setRevealedSpoilerReviewIds((current) =>
      current.includes(reviewId) ? current : [...current, reviewId]
    );
  }

  function saveCreatedReview(reviewDraft) {
    if (reviewDraft.mode === "rating") {
      const nextRating = {
        local: true,
        user: profileOverride?.name || "Yasmin",
        handle: currentUserHandle,
        avatar: profileOverride?.avatar || "Y",
        time: "agora",
        bookId: reviewDraft.bookId,
        rating: reviewDraft.rating
      };

      setCreatedRatings((current) => {
        const existingRating = current.find(
          (ratingItem) => ratingItem.bookId === reviewDraft.bookId && ratingItem.handle === currentUserHandle
        );

        if (existingRating) {
          return current.map((ratingItem) =>
            ratingItem.id === existingRating.id ? { ...ratingItem, ...nextRating } : ratingItem
          );
        }

        return [{ ...nextRating, id: `user-rating-${current.length + 1}` }, ...current];
      });

      return { type: "rating", bookId: reviewDraft.bookId };
    }

    const nextReview = {
      id: `user-review-${createdReviews.length + 1}`,
      local: true,
      user: profileOverride?.name || "Yasmin",
      handle: currentUserHandle,
      avatar: profileOverride?.avatar || "Y",
      time: "agora",
      postedAt: "agora - 14/06/2026",
      views: "0",
      bookId: reviewDraft.bookId,
      rating: reviewDraft.rating,
      text: reviewDraft.text,
      likes: 0,
      comments: 0,
      liked: false,
      hasSpoiler: reviewDraft.hasSpoiler
    };

    setCreatedReviews((current) => [nextReview, ...current]);
    return { type: "review", reviewId: nextReview.id };
  }

  function saveCreatedComment(commentDraft) {
    const nextComment = {
      id: `user-comment-${createdComments.length + 1}`,
      local: true,
      reviewId: commentDraft.reviewId,
      user: profileOverride?.name || "Yasmin",
      handle: currentUserHandle,
      avatar: profileOverride?.avatar || "Y",
      time: "agora",
      text: commentDraft.replyingTo ? `@${commentDraft.replyingTo} ${commentDraft.text}` : commentDraft.text,
      likes: 0,
      liked: false
    };

    setCreatedComments((current) => [nextComment, ...current]);
  }

  function deleteComment(commentId) {
    setCreatedComments((current) => current.filter((comment) => comment.id !== commentId));
    setDeletedCommentIds((current) =>
      current.includes(commentId) ? current : [...current, commentId]
    );
    setEditedCommentTexts((current) => {
      const next = { ...current };
      delete next[commentId];
      return next;
    });
    setLikedCommentIds((current) => current.filter((likedCommentId) => likedCommentId !== commentId));
  }

  function editComment(commentId, text) {
    setCreatedComments((current) =>
      current.map((comment) =>
        comment.id === commentId ? { ...comment, text, edited: true } : comment
      )
    );
    setEditedCommentTexts((current) => ({ ...current, [commentId]: text }));
  }

  function deleteReview(reviewId) {
    setCreatedReviews((current) => current.filter((review) => review.id !== reviewId));
    setDeletedReviewIds((current) =>
      current.includes(reviewId) ? current : [...current, reviewId]
    );
    setEditedReviewTexts((current) => {
      const next = { ...current };
      delete next[reviewId];
      return next;
    });
    setSavedReviewIds((current) => current.filter((savedReviewId) => savedReviewId !== reviewId));
    setLikedReviewIds((current) => current.filter((likedReviewId) => likedReviewId !== reviewId));
  }

  function editReview(reviewId, text) {
    setCreatedReviews((current) =>
      current.map((review) =>
        review.id === reviewId ? { ...review, text, edited: true } : review
      )
    );
    setEditedReviewTexts((current) => ({ ...current, [reviewId]: text }));
  }

  function deleteRating(bookId) {
    setCreatedRatings((current) =>
      current.filter((rating) => !(rating.bookId === bookId && rating.handle === currentUserHandle))
    );
  }

  return {
    allComments,
    allReviews,
    createdRatings,
    deleteComment,
    deleteRating,
    deleteReview,
    editComment,
    editReview,
    likedCommentIds,
    likedReviewIds,
    revealSpoilerReview,
    revealedSpoilerReviewIds,
    savedReviewIds,
    saveCreatedComment,
    saveCreatedReview,
    toggleCommentLike,
    toggleReviewLike,
    toggleReviewSave
  };
}
