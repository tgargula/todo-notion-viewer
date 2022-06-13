import { ColorSchemeName } from "react-native";

export const getTextColor = (scheme: ColorSchemeName) => {
  if (scheme === 'dark') {
    return '#fff';
  }

  return '#223';
}

export const getBackgroundColor = (scheme: ColorSchemeName) => {
  if (scheme === 'dark') {
    return '#223';
  }

  return '#dde';
}