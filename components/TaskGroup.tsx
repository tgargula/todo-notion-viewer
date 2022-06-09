import { FlatList, StyleSheet, Text, View } from "react-native";
import { renderTask, TaskProps } from "./Task";

export type TaskGroupProps = {
  name: string;
  data: TaskProps[];
};

function TaskGroup({ name, data }: TaskGroupProps) {
  return (
    <View>
      <Text style={styles.header}>{name}</Text>
      <FlatList
        data={data}
        renderItem={renderTask}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}

export function renderTaskGroup({ item: { name, data } }: { item: TaskGroupProps }) {
  return <TaskGroup name={name} data={data} />;
}

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});
