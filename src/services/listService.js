import { mockLists } from "../data/mockLists";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getLists() {
  return mockLists;
}

export function getListById(listId) {
  return mockLists.find((list) => list.id === listId);
}

export function getPublicLists() {
  return mockLists.filter((list) => !list.private);
}

export function getListsByCreator(creator) {
  return mockLists.filter((list) => list.creator === creator);
}

export function getListsByTag(tag) {
  const normalizedTag = normalize(tag);
  return mockLists.filter((list) => normalize(list.tag) === normalizedTag);
}

export function searchLists(query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return mockLists;
  }

  return mockLists.filter((list) =>
    normalize(`${list.title} ${list.creator} ${list.handle} ${list.description} ${list.tag}`).includes(normalizedQuery)
  );
}
