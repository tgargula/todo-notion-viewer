import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Status = "To do" | "In progress";

export type TaskProps = {
  title: string;
  status: Status;
  deadline?: Date;
};

function Task({ title, status, deadline }: TaskProps) {
  return (
    <TouchableOpacity style={styles.task}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  left: {
    flexShrink: 1,
    paddingRight: 32,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
  },
  text: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
