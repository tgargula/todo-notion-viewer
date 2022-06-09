import { useCallback, useEffect, useState } from "react";
import { FlatList, View, RefreshControl, Text, StyleSheet } from "react-native";
import { fetchTasks } from "../actions/fetchTasks";
import { renderTaskGroup, TaskGroupProps } from "./TaskGroup";

export function TaskGroupList() {
  const [tasks, setTasks] = useState<TaskGroupProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(async () => {
    setError(false);
    setRefreshing(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.error}>An error occured ❌</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        renderItem={renderTaskGroup}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "#fff",
    marginTop: 16,
    alignSelf: "center",
  },
});
