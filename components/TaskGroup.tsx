import { formatDistance, max, min } from "date-fns";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import useNow from "../hooks/useNow";
import { getTextColor } from "../styles/default";
import { renderTask, TaskProps } from "./Task";

export type TaskGroupProps = {
  name: string;
  data: TaskProps[];
  lastUpdatedAt?: Date | null;
};

function TaskGroup({ name, data, lastUpdatedAt }: TaskGroupProps) {
  const scheme = useColorScheme();
  const now = useNow([lastUpdatedAt]);

  return (
    <View>
      <View style={styles.spaceBetween}>
        <Text style={[styles.header, { color: getTextColor(scheme) }]}>
          {name}
        </Text>
        <Text style={styles.updateInfo}>
          {!!lastUpdatedAt &&
            `Updated ${formatDistance(
              min([lastUpdatedAt, now]),
              max([lastUpdatedAt, now]),
              { addSuffix: true }
            )}`}
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderTask}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}

export function renderTaskGroup(
  {
    item: { name, data },
  }: {
    item: TaskGroupProps;
  },
  lastUpdatedAt?: Date | null
) {
  return (
    <TaskGroup name={name} data={data} lastUpdatedAt={lastUpdatedAt ?? null} />
  );
}

const styles = StyleSheet.create({
  header: {
    lineHeight: 32,
    fontSize: 16,
    fontWeight: "600",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  updateInfo: {
    color: "gray",
    lineHeight: 36,
    fontSize: 12,
    alignContent: "center",
  },
});
