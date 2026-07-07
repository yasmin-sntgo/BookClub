import { useEffect, useState } from "react";
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
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";

export function LoginScreen({ initialEmail = "", accountNotice = "", onCreateAccount, onLogin }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [resetNotice, setResetNotice] = useState("");

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  return (
    <SafeAreaView style={styles.safe}>
      <BackgroundGlow />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.wrap}>
          <BrandLogo />

          <AuthCard>
            <Text style={styles.cardTitle}>Bem-vindo de volta</Text>
            <Text style={styles.cardSub}>sua proxima historia esta esperando</Text>

            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="seu@email.com"
            />

            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="********"
            />

            <Pressable
              accessibilityRole="button"
              onPress={() => setResetNotice("Confira seu e-mail para recuperar o acesso.")}
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>esqueci minha senha</Text>
            </Pressable>
            {accountNotice ? <Text style={styles.accountNotice}>{accountNotice}</Text> : null}
            {resetNotice ? <Text style={styles.resetNotice}>{resetNotice}</Text> : null}

            <AppButton onPress={onLogin} style={styles.loginButton}>Entrar</AppButton>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.register}>
              <Text style={styles.registerText}>Primeira vez por aqui? </Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={onCreateAccount}
                style={styles.linkButton}
              >
                <Text onPress={onCreateAccount} style={styles.registerLink}>Criar conta</Text>
              </Pressable>
            </View>
          </AuthCard>

          <Text style={styles.footer}></Text>
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
  forgot: {
    alignSelf: "flex-end",
    marginTop: -6
  },
  forgotText: {
    ...type.smallItalic,
    color: colors.textMuted,
    textDecorationLine: "underline"
  },
  resetNotice: {
    ...type.small,
    color: colors.textMuted,
    alignSelf: "flex-end",
    textAlign: "right",
    marginTop: spacing.xs
  },
  accountNotice: {
    ...type.small,
    color: colors.accent,
    alignSelf: "stretch",
    textAlign: "center",
    marginTop: spacing.xs
  },
  loginButton: {
    marginTop: spacing.lg
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
  register: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  registerText: {
    ...type.small,
    color: colors.textSoft
  },
  registerLink: {
    ...type.smallItalic,
    color: colors.accent,
    textDecorationLine: "underline"
  },
  linkButton: {
    minHeight: 24,
    justifyContent: "center"
  },
  footer: {
    ...type.smallItalic,
    color: colors.textMuted,
    marginTop: spacing.lg,
    textAlign: "center"
  }
});
