import { mockComments } from "../data/mockComments";
import { mockReviews } from "../data/mockReviews";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getReviews() {
  return mockReviews;
}

export function getReviewById(reviewId) {
  return mockReviews.find((review) => review.id === reviewId);
}

export function getReviewsByBookId(bookId) {
  return mockReviews.filter((review) => review.bookId === bookId);
}

export function getReviewsByUserHandle(handle) {
  return mockReviews.filter((review) => review.handle === handle);
}

export function getRecentReviews(limit) {
  const reviews = [...mockReviews];
  return limit ? reviews.slice(0, limit) : reviews;
}

export function searchReviews(query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return mockReviews;
  }

  return mockReviews.filter((review) =>
    normalize(`${review.user} ${review.handle} ${review.text}`).includes(normalizedQuery)
  );
}

export function getComments() {
  return mockComments;
}

export function getCommentsByReviewId(reviewId) {
  return mockComments.filter((comment) => comment.reviewId === reviewId);
}

export function getCommentById(commentId) {
  return mockComments.find((comment) => comment.id === commentId);
}

export function getCommentsByUserHandle(handle) {
  return mockComments.filter((comment) => comment.handle === handle);
}
