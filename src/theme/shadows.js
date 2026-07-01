import { colors } from "./colors";

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 35,
    elevation: 16
  },
  button: {
    shadowColor: colors.accent,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8
  }
};
