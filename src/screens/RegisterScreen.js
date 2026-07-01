import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AuthCard } from "../components/AuthCard";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { BrandLogo } from "../components/BrandLogo";
import { MascotTentacles } from "../components/MascotTentacles";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";

export function RegisterScreen({ onCreateAccount, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <BackgroundGlow />
      <MascotTentacles />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.wrap}>
          <BrandLogo />

          <AuthCard>
            <Text style={styles.cardTitle}>Comece sua estante</Text>
            <Text style={styles.cardSub}>guarde leituras, resenhas e desejos em um so lugar</Text>

            <AppInput
              label="Nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholder="como devemos te chamar?"
            />

            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="seu@email.com"
            />

            <AppInput
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              placeholder="@seunome"
            />

            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="********"
            />

            <AppButton onPress={onCreateAccount} style={styles.createButton}>Criar conta</AppButton>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.login}>
              <Text style={styles.loginText}>Ja tem uma conta? </Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={onLogin}
                style={styles.linkButton}
              >
                <Text onPress={onLogin} style={styles.loginLink}>Entrar</Text>
              </Pressable>
            </View>
          </AuthCard>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  keyboard: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2
  },
  wrap: {
    width: "100%",
    maxWidth: 370,
    alignSelf: "center",
    paddingHorizontal: 22,
    alignItems: "center",
    zIndex: 2
  },
  cardTitle: {
    ...type.title,
    color: colors.text,
    textAlign: "center"
  },
  cardSub: {
    ...type.subtitle,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 1,
    marginBottom: spacing.xl
  },
  createButton: {
    marginTop: spacing.sm
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    marginBottom: 14
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    ...type.smallItalic,
    color: colors.textMuted
  },
  login: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  loginText: {
    ...type.small,
    color: colors.textSoft
  },
  loginLink: {
    ...type.smallItalic,
    color: colors.accent,
    textDecorationLine: "underline"
  },
  linkButton: {
    minHeight: 24,
    justifyContent: "center"
  }
});
