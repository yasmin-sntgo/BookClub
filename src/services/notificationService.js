import { mockNotifications } from "../data/mockNotifications";

export function getNotifications() {
  return mockNotifications;
}

export function getNotificationById(notificationId) {
  return mockNotifications.find((notification) => notification.id === notificationId);
}

export function getUnreadNotifications(readNotificationIds = []) {
  return mockNotifications.filter((notification) => !notification.read && !readNotificationIds.includes(notification.id));
}

export function getNotificationsByType(type) {
  return mockNotifications.filter((notification) => notification.type === type);
}
