import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { colors } from "../theme/colors";

export function BackgroundGlow() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id="authBackground" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.09" />
          <Stop offset="42%" stopColor={colors.background} stopOpacity="0.02" />
          <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#authBackground)" />
    </Svg>
  );
}
