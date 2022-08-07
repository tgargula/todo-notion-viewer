import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { FlatList, View, RefreshControl, StyleSheet } from "react-native";
import { fetchTasks } from "../actions/fetchTasks";
import { EmptyListComponent } from "./EmptyListComponent";
import { renderTaskGroup, TaskGroupProps } from "./TaskGroup";

export function TaskGroupList() {
  const [tasks, setTasks] = useState<TaskGroupProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      await onRender();
      onRefresh();
    })();
  }, []);

  const onRender = useCallback(async () => {
    const storedTasks = await AsyncStorage.getItem("tasks");
    if (!storedTasks) return;

    const maybeTasks = JSON.parse(storedTasks);
    if (!Array.isArray(maybeTasks.tasks)) return;

    setTasks(maybeTasks.tasks);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(false);
    try {
      const fetchedTasks = await fetchTasks();
      AsyncStorage.setItem(
        "tasks",
        JSON.stringify({
          tasks: fetchedTasks,
          lastUpdatedAt: new Date().toUTCString(),
        })
      );
      setTasks(fetchedTasks);
    } catch (err) {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <View style={styles.view}>
      <FlatList
        data={tasks}
        renderItem={renderTaskGroup}
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
