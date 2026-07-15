import { useMemo } from "react";

import { getNotifications } from "../services";
import { usePersistentState } from "./usePersistentState";

const baseNotifications = getNotifications();

export function useNotifications() {
  const [notificationPreferences, setNotificationPreferences] = usePersistentState(
    "bookclub:notificationPreferences",
    {
      social: true,
      books: true
    }
  );
  const [readNotificationIds, setReadNotificationIds] = usePersistentState("bookclub:readNotificationIds", []);

  const notifications = useMemo(
    () =>
      baseNotifications.filter((notification) => {
        const socialTypes = ["follow", "reply", "comment", "like"];
        const bookTypes = ["list", "book"];

        if (!notificationPreferences.social && socialTypes.includes(notification.type)) {
          return false;
        }

        if (!notificationPreferences.books && bookTypes.includes(notification.type)) {
          return false;
        }

        return true;
      }),
    [notificationPreferences]
  );

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read && !readNotificationIds.includes(notification.id)
  ).length;

  function markNotificationRead(notificationId) {
    setReadNotificationIds((current) =>
      current.includes(notificationId) ? current : [...current, notificationId]
    );
  }

  function markAllNotificationsRead() {
    setReadNotificationIds(notifications.map((notification) => notification.id));
  }

  function toggleNotificationPreference(preferenceId) {
    setNotificationPreferences((current) => ({
      ...current,
      [preferenceId]: !current[preferenceId]
    }));
  }

  return {
    markAllNotificationsRead,
    markNotificationRead,
    notificationPreferences,
    notifications,
    readNotificationIds,
    toggleNotificationPreference,
    unreadNotificationsCount
  };
}
