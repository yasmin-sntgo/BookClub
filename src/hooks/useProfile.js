import { useState } from "react";

import { getUsers } from "../services";

const baseUsers = getUsers();
const initialFollowedUserIds = baseUsers.find((user) => user.id === "yasmin")?.followingIds ?? [];

export function useProfile() {
  const [profileOverride, setProfileOverride] = useState(null);
  const [registeredAccount, setRegisteredAccount] = useState(null);
  const [followedUserIds, setFollowedUserIds] = useState(initialFollowedUserIds);

  const currentUserHandle = profileOverride?.handle || "@yasmin_le";

  function registerAccount(account) {
    const cleanEmail = account?.email?.trim() ?? "";
    const cleanName = account?.name?.trim();
    const cleanUsername = account?.username?.trim();

    setRegisteredAccount({
      ...account,
      email: cleanEmail,
      username: cleanUsername
    });

    setProfileOverride((current) => ({
      ...current,
      name: cleanName || current?.name || "Yasmin",
      handle: cleanUsername
        ? cleanUsername.startsWith("@")
          ? cleanUsername
          : `@${cleanUsername}`
        : current?.handle || "@yasmin_le",
      avatar: (cleanName || cleanUsername || "Y").slice(0, 1).toUpperCase()
    }));
  }

  function saveProfile(nextProfile) {
    setProfileOverride(nextProfile);
  }

  function toggleFollow(userId) {
    if (userId === "yasmin") {
      return;
    }

    setFollowedUserIds((current) =>
      current.includes(userId)
        ? current.filter((followedUserId) => followedUserId !== userId)
        : [...current, userId]
    );
  }

  return {
    currentUserHandle,
    followedUserIds,
    profileOverride,
    registeredAccount,
    registerAccount,
    saveProfile,
    toggleFollow
  };
}
