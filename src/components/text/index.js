import React from "react";
import { Text as RNText } from "react-native";

const fontMap = {
  regular: "Nunito-Regular",
  light: "Nunito-Light",
  extraLight: "Nunito-ExtraLight",
  medium: "Nunito-Medium",
  semibold: "Nunito-SemiBold",
  bold: "Nunito-Bold",
  extraBold: "Nunito-ExtraBold",
  black: "Nunito-Black",
};

export default function Text({
  children,
  variant = "regular",
  style,
  ...props
}) {
  return (
    <RNText
      style={[
        {
          fontFamily: fontMap[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}