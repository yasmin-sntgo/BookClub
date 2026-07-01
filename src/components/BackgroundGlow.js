import { StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { colors } from "../theme/colors";

export function BackgroundGlow() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <RadialGradient id="blueGlow" cx="18%" cy="16%" rx="56%" ry="42%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.13" />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="warmGlow" cx="86%" cy="84%" rx="46%" ry="48%">
          <Stop offset="0%" stopColor={colors.warm} stopOpacity="0.09" />
          <Stop offset="100%" stopColor={colors.warm} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#blueGlow)" />
      <Rect width="100%" height="100%" fill="url(#warmGlow)" />
    </Svg>
  );
}
