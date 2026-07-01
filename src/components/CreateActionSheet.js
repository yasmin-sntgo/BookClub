import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fonts, type } from "../theme/typography";
import { Icon } from "./Icon";

const actions = [
  {
    id: "review",
    icon: "comment",
    title: "Escrever resenha",
    description: "Escolha um livro e publique sua opiniao."
  },
  {
    id: "rating",
    icon: "starOutline",
    title: "Avaliar livro",
    description: "De uma nota sem escrever uma resenha."
  },
  {
    id: "shelf",
    icon: "books",
    title: "Adicionar a estante",
    description: "Marque como lendo, quero ler, lido ou abandonado."
  },
  {
    id: "list",
    icon: "list",
    title: "Criar lista",
    description: "Monte uma selecao de livros para salvar e compartilhar."
  }
];

export function CreateActionSheet({ visible, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Criar no BookClub</Text>
          <Text style={styles.subtitle}>Escolha por onde quer comecar.</Text>

          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable key={action.id} onPress={() => onClose(action.id)} style={styles.action}>
                <View style={styles.iconBubble}>
                  <Icon name={action.icon} color={colors.accent} size={22} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  sheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderRadius: 28,
    backgroundColor: "rgba(18,18,18,0.98)",
    borderWidth: 1,
    borderColor: "rgba(240,236,228,0.12)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.58,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 40,
    elevation: 24
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "rgba(240,236,228,0.18)",
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29
  },
  subtitle: {
    ...type.small,
    color: colors.textMuted,
    marginTop: 3,
    marginBottom: spacing.lg
  },
  actions: {
    gap: spacing.sm
  },
  action: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: colors.border
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentWash,
    borderWidth: 1,
    borderColor: "rgba(157,192,216,0.2)"
  },
  actionCopy: {
    flex: 1,
    minWidth: 0
  },
  actionTitle: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 19
  },
  actionDescription: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  }
});
