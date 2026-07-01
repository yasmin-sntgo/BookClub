import { StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";
import { Icon } from "./Icon";

export function RatingStars({ rating, size = 13 }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={size}
          color={star <= Math.round(rating) ? colors.warm : "rgba(240,236,228,0.16)"}
          fill={star <= Math.round(rating) ? colors.warm : "rgba(240,236,228,0.16)"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 2
  }
});
