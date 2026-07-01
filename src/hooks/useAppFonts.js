import { useFonts } from "expo-font";
import {
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold
} from "@expo-google-fonts/fraunces";
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold
} from "@expo-google-fonts/nunito-sans";

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold
  });

  return fontsLoaded;
}
