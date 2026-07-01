import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

export function BookCover({ book, size = "medium", showTitle = false }) {
  if (book.coverUrl) {
    return (
      <Image
        source={{ uri: book.coverUrl }}
        resizeMode="cover"
        style={[styles.cover, styles[size], styles.imageCover]}
      />
    );
  }

  return (
    <LinearGradient
      colors={book.coverColors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.cover, styles[size]]}
    >
      <View style={styles.spine} />
      <Text style={[styles.mark, size === "large" && styles.largeMark]}>{book.mark}</Text>
      {showTitle ? <Text style={styles.title}>{book.title}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5
  },
  imageCover: {
    backgroundColor: colors.surface
  },
  small: {
    width: 52,
    height: 78
  },
  tiny: {
    width: 44,
    height: 66
  },
  medium: {
    width: 112,
    height: 168
  },
  listPreview: {
    width: 82,
    height: 123
  },
  grid: {
    width: "100%",
    aspectRatio: 2 / 3
  },
  large: {
    width: "100%",
    height: "100%"
  },
  spine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  mark: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    letterSpacing: 0,
    opacity: 0.92
  },
  largeMark: {
    fontSize: 34
  },
  title: {
    position: "absolute",
    left: 10,
    right: 8,
    bottom: 8,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12
  }
});
