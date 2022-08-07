import { FlatList, View, RefreshControl, StyleSheet } from "react-native";
import useTasks from "../hooks/useTasks";
import { EmptyListComponent } from "./EmptyListComponent";
import { renderTaskGroup } from "./TaskGroup";

export function TaskGroupList() {
  const { tasks, error, refreshing, onRefresh } = useTasks();

  return (
    <View style={styles.view}>
      <FlatList
        data={tasks.data}
        renderItem={(item) => renderTaskGroup(item, tasks.lastUpdatedAt)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyListComponent refreshing={refreshing} error={error} />
        }
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  error: {
    marginTop: 16,
    alignSelf: "center",
  },
});
