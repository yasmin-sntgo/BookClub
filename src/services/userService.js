import { mockUsers } from "../data/mockUsers";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getUsers() {
  return mockUsers;
}

export function getUserById(userId) {
  return mockUsers.find((user) => user.id === userId);
}

export function getUserByHandle(handle) {
  return mockUsers.find((user) => user.handle === handle);
}

export function getFollowers(userId) {
  const user = getUserById(userId);
  return user?.followerIds?.map(getUserById).filter(Boolean) ?? [];
}

export function getFollowing(userId) {
  const user = getUserById(userId);
  return user?.followingIds?.map(getUserById).filter(Boolean) ?? [];
}

export function searchUsers(query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return mockUsers;
  }

  return mockUsers.filter((user) =>
    normalize(`${user.name} ${user.handle} ${user.bio}`).includes(normalizedQuery)
  );
}
