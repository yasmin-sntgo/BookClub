import Svg, { Circle, Line, Path } from "react-native-svg";

import { colors } from "../theme/colors";

export function EyeIcon({ hidden }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      {hidden ? (
        <>
          <Path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
            stroke={colors.textMuted}
            strokeWidth={1.8}
          />
          <Circle cx={12} cy={12} r={3} stroke={colors.textMuted} strokeWidth={1.8} />
        </>
      ) : (
        <>
          <Path
            d="M17.9 17.9A9.8 9.8 0 0 1 12 20C5.6 20 2 12 2 12a18.4 18.4 0 0 1 4.9-5.9"
            stroke={colors.textMuted}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M9.9 4.2A9 9 0 0 1 12 4c6.4 0 10 8 10 8a18.4 18.4 0 0 1-2.1 3.2"
            stroke={colors.textMuted}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Line
            x1={3}
            y1={3}
            x2={21}
            y2={21}
            stroke={colors.textMuted}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}
