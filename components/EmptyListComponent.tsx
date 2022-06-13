import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { getTextColor } from "../styles/default";

type Props = {
  refreshing: boolean;
  error: boolean;
};

export function EmptyListComponent({ error, refreshing }: Props) {
  const scheme = useColorScheme();

  if (refreshing) {
    return null;
  }

  return (
    <View style={styles.view}>
      <Text style={[styles.text, { color: getTextColor(scheme) }]}>
        {error ? "An error occured ❌" : "A list is empty"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  text: {
    marginTop: 16,
    alignSelf: "center",
  },
});
