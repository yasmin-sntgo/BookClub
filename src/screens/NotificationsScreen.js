import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts } from "../theme/typography";

export function NotificationsScreen({
  notifications,
  readNotificationIds = [],
  onBack,
  onBookOpen,
  onCreate,
  onListOpen,
  onMarkAllRead,
  onNavigate,
  onNotificationRead,
  onReviewOpen,
  onUserOpen
}) {
  const unreadCount = notifications.filter((notification) => isUnread(notification, readNotificationIds)).length;

  function openNotification(notification) {
    onNotificationRead?.(notification.id);

    if (notification.reviewId) {
      onReviewOpen?.(notification.reviewId, "reviews");
      return;
    }

    if (notification.listId) {
      onListOpen?.(notification.listId, "notifications");
      return;
    }

    if (notification.bookId) {
      onBookOpen?.(notification.bookId, "notifications");
      return;
    }

    if (notification.userId) {
      onUserOpen?.(notification.userId);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Icon name="back" color={colors.textSoft} size={24} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Notificacoes</Text>
            <Text style={styles.subtitle}>
              {unreadCount > 0 ? `${unreadCount} novas` : "Tudo em dia"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={unreadCount === 0}
            onPress={onMarkAllRead}
            style={[styles.readButton, unreadCount === 0 && styles.readButtonDisabled]}
          >
            <Text style={[styles.readButtonText, unreadCount === 0 && styles.readButtonTextDisabled]}>
              Marcar lidas
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {notifications.length > 0 ? (
            <View style={styles.list}>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  unread={isUnread(notification, readNotificationIds)}
                  onPress={() => openNotification(notification)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sem notificacoes</Text>
              <Text style={styles.emptyText}>
                Curtidas, comentarios, seguidores e novidades das listas aparecem aqui.
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomNav activeTab="home" onChange={onNavigate} onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}

function NotificationCard({ notification, unread, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, unread && styles.unreadCard]}
    >
      <View style={[styles.iconWrap, unread && styles.unreadIconWrap]}>
        <Icon
          name={getIconName(notification.type)}
          color={unread ? colors.text : colors.textSoft}
          size={20}
          fill={notification.type === "like" && unread ? colors.text : "none"}
          strokeWidth={2.1}
        />
      </View>

      <View style={styles.cardCopy}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={2}>{notification.title}</Text>
          {unread ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.cardBody} numberOfLines={2}>{notification.body}</Text>
        <Text style={styles.cardTime}>{notification.time}</Text>
      </View>
    </Pressable>
  );
}

function getIconName(type) {
  if (type === "follow") {
    return "user";
  }

  if (type === "comment") {
    return "comment";
  }

  if (type === "like") {
    return "heart";
  }

  if (type === "list") {
    return "list";
  }

  return "bell";
}

function isUnread(notification, readNotificationIds) {
  return !notification.read && !readNotificationIds.includes(notification.id);
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center"
  },
  shell: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.background,
    position: "relative",
    overflow: "hidden",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border
  },
  header: {
    minHeight: 92,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(16,16,16,0.96)"
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: colors.border
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: "center"
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 31
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  readButton: {
    minHeight: 42,
    borderRadius: 15,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.22)"
  },
  readButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.025)",
    borderColor: colors.border
  },
  readButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 11
  },
  readButtonTextDisabled: {
    color: colors.textFaint
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  card: {
    minHeight: 86,
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  unreadCard: {
    borderBottomColor: "rgba(157,192,216,0.2)"
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)"
  },
  unreadIconWrap: {
    backgroundColor: "rgba(157,192,216,0.14)"
  },
  cardCopy: {
    flex: 1,
    minWidth: 0
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    backgroundColor: colors.accent
  },
  cardBody: {
    color: "#d1c8b8",
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5
  },
  cardTime: {
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 8
  },
  empty: {
    minHeight: 148,
    borderRadius: 24,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm
  }
});
