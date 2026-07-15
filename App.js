import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useAppFonts } from "./src/hooks/useAppFonts";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>BookClub</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  loadingLogo: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 30,
    lineHeight: 36
  }
});
