import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { format, formatDistance, formatRelative } from "date-fns";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { getBackgroundColor, getTextColor } from "../styles/default";
import { Category, RootStackParamList, Status } from "../types/types";
import { formatDeadline } from "../utils/formatDeadline";

export type TaskProps = {
  id: string;
  title: string;
  status: Status;
  deadline?: Date;
  category: Category;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

function Task({ id, title, status, deadline, category }: TaskProps) {
  const scheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={[styles.task, { backgroundColor: getBackgroundColor(scheme) }]}
      onPress={() =>
        navigation.navigate("TaskDetails", { id, title, category })
      }
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: getTextColor(scheme) }]}>
          {title}
        </Text>
        {deadline && (
          <Text style={styles.text}>
            {formatDistance(formatDeadline(deadline), new Date(), {
              addSuffix: true,
            })}
          </Text>
        )}
      </View>
      <Text style={styles.text}>{status}</Text>
    </TouchableOpacity>
  );
}

export function renderTask({
  item: { id, title, status, deadline, category },
}: {
  item: TaskProps;
}) {
  return (
    <Task
      id={id}
      title={title}
      status={status}
      deadline={deadline}
      category={category}
    />
  );
}

const styles = StyleSheet.create({
  task: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  left: {
    flexShrink: 1,
    paddingRight: 16,
  },
  title: {
    fontWeight: "600",
  },
  text: {
    color: "#888",
  },
});
