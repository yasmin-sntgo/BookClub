import { useMemo } from "react";

import { getLists } from "../services";
import { usePersistentState } from "./usePersistentState";

const baseLists = getLists();
const initialSavedListIds = ["crying", "sci-fi-start"];

export function useLists({ currentUserHandle = "@yasmin_le", profileOverride = null } = {}) {
  const [savedListIds, setSavedListIds] = usePersistentState("bookclub:savedListIds", initialSavedListIds);
  const [createdLists, setCreatedLists] = usePersistentState("bookclub:createdLists", []);
  const [deletedListIds, setDeletedListIds] = usePersistentState("bookclub:deletedListIds", []);

  const lists = useMemo(
    () => [...createdLists, ...baseLists].filter((list) => !deletedListIds.includes(list.id)),
    [createdLists, deletedListIds]
  );

  function toggleListSave(listId) {
    setSavedListIds((current) =>
      current.includes(listId)
        ? current.filter((savedListId) => savedListId !== listId)
        : [...current, listId]
    );
  }

  function createList(listDraft) {
    const nextList = {
      id: `user-list-${createdLists.length + 1}`,
      local: true,
      title: listDraft.title,
      creator: profileOverride?.name || "Yasmin",
      handle: currentUserHandle,
      description: listDraft.description || "lista criada por você no BookClub.",
      booksCount: listDraft.bookIds.length,
      saves: "0",
      createdAt: "2026",
      updatedAt: "criada agora",
      ordered: listDraft.ordered,
      private: listDraft.private,
      tag: listDraft.tag,
      bookIds: listDraft.bookIds
    };

    setCreatedLists((current) => [nextList, ...current]);
    return nextList;
  }

  function editList(listDraft) {
    const nextList = {
      title: listDraft.title,
      description: listDraft.description || "lista criada por você no BookClub.",
      booksCount: listDraft.bookIds.length,
      updatedAt: "atualizada agora",
      ordered: listDraft.ordered,
      private: listDraft.private,
      tag: listDraft.tag,
      bookIds: listDraft.bookIds
    };

    setCreatedLists((current) =>
      current.map((list) => (list.id === listDraft.id ? { ...list, ...nextList } : list))
    );

    return { id: listDraft.id, ...nextList };
  }

  function setListPrivacy(listId, nextPrivate) {
    setCreatedLists((current) =>
      current.map((list) => (list.id === listId ? { ...list, private: nextPrivate } : list))
    );
  }

  function deleteList(listId) {
    setCreatedLists((current) => current.filter((list) => list.id !== listId));
    setDeletedListIds((current) =>
      current.includes(listId) ? current : [...current, listId]
    );
    setSavedListIds((current) => current.filter((savedListId) => savedListId !== listId));
  }

  return {
    createList,
    deleteList,
    editList,
    lists,
    savedListIds,
    setListPrivacy,
    toggleListSave
  };
}
