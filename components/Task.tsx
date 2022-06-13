import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { getBackgroundColor, getTextColor } from "../styles/default";

type Status = "To do" | "In progress";

export type TaskProps = {
  title: string;
  status: Status;
  deadline?: Date;
};

function Task({ title, status, deadline }: TaskProps) {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[styles.task, { backgroundColor: getBackgroundColor(scheme) }]}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: getTextColor(scheme) }]}>
          {title}
        </Text>
        {deadline && <Text style={styles.text}>{String(deadline)}</Text>}
      </View>
      <Text style={styles.text}>{status}</Text>
    </TouchableOpacity>
  );
}

export function renderTask({
  item: { title, status, deadline },
}: {
  item: TaskProps;
}) {
  return <Task title={title} status={status} deadline={deadline} />;
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
