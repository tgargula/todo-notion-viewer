import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  View,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { fetchTasks } from "../actions/fetchTasks";
import { EmptyListComponent } from "./EmptyListComponent";
import { renderTaskGroup, TaskGroupProps } from "./TaskGroup";

export function TaskGroupList() {
  const [tasks, setTasks] = useState<TaskGroupProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(false);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(true);
      setTasks([]);
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
        ListEmptyComponent={<EmptyListComponent refreshing={refreshing} error={error} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  error: {
    marginTop: 16,
    alignSelf: "center",
  },
});
