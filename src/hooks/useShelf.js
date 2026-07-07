import { useState } from "react";

const initialShelfEntries = [
  { bookId: "dune", status: "reading", favorite: true },
  { bookId: "it", status: "reading", favorite: false },
  { bookId: "sunrise", status: "want", favorite: false },
  { bookId: "hobbit", status: "read", favorite: true },
  { bookId: "housemaid", status: "abandoned", favorite: false }
];

const statusByLabel = {
  Lendo: "reading",
  "Quero ler": "want",
  Lido: "read",
  Abandonado: "abandoned"
};

export function useShelf() {
  const [shelfEntries, setShelfEntries] = useState(initialShelfEntries);
  const [shelfPrivate, setShelfPrivate] = useState(false);

  function saveShelfEntry(nextEntry) {
    setShelfEntries((current) => {
      const alreadyExists = current.some((entry) => entry.bookId === nextEntry.bookId);

      if (!alreadyExists) {
        return [...current, nextEntry];
      }

      return current.map((entry) =>
        entry.bookId === nextEntry.bookId ? { ...entry, ...nextEntry } : entry
      );
    });
  }

  function setBookShelfStatus(bookId, statusLabel) {
    const nextStatus = statusByLabel[statusLabel] ?? "want";

    setShelfEntries((current) => {
      const existingEntry = current.find((entry) => entry.bookId === bookId);

      if (!existingEntry) {
        return [...current, { bookId, status: nextStatus, favorite: false }];
      }

      return current.map((entry) =>
        entry.bookId === bookId ? { ...entry, status: nextStatus } : entry
      );
    });
  }

  function toggleBookFavorite(bookId) {
    setShelfEntries((current) => {
      const existingEntry = current.find((entry) => entry.bookId === bookId);

      if (!existingEntry) {
        return [...current, { bookId, status: "want", favorite: true }];
      }

      return current.map((entry) =>
        entry.bookId === bookId ? { ...entry, favorite: !entry.favorite } : entry
      );
    });
  }

  return {
    saveShelfEntry,
    setBookShelfStatus,
    setShelfPrivate,
    shelfEntries,
    shelfPrivate,
    toggleBookFavorite
  };
}
