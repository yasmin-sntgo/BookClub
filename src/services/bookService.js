import { mockBooks } from "../data/mockBooks";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getBooks() {
  return mockBooks;
}

export function getBookById(bookId) {
  return mockBooks.find((book) => book.id === bookId);
}

export function getPopularBooks(limit) {
  const books = [...mockBooks].sort((firstBook, secondBook) => secondBook.rating - firstBook.rating);
  return limit ? books.slice(0, limit) : books;
}

export function getRecentBooks(limit) {
  const books = [...mockBooks].sort((firstBook, secondBook) => Number(secondBook.year) - Number(firstBook.year));
  return limit ? books.slice(0, limit) : books;
}

export function getBooksByGenre(genre) {
  const normalizedGenre = normalize(genre);
  return mockBooks.filter((book) => normalize(book.genre) === normalizedGenre);
}

export function getSimilarBooks(bookId, limit) {
  const book = getBookById(bookId);

  if (!book) {
    return [];
  }

  const sameGenre = mockBooks.filter((item) => item.id !== book.id && item.genre === book.genre);
  const others = mockBooks.filter((item) => item.id !== book.id && item.genre !== book.genre);
  const books = [...sameGenre, ...others];

  return limit ? books.slice(0, limit) : books;
}

export function searchBooks(query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return mockBooks;
  }

  return mockBooks.filter((book) =>
    normalize(`${book.title} ${book.author} ${book.genre} ${book.publisher}`).includes(normalizedQuery)
  );
}
