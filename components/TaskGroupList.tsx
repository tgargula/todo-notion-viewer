import { useCallback, useEffect, useState } from "react";
import { FlatList, View, RefreshControl } from "react-native";
import { fetchTasks } from "../actions/fetchTasks";
import { renderTaskGroup, TaskGroupProps } from "./TaskGroup";

export function TaskGroupList() {
  const [tasks, setTasks] = useState<TaskGroupProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
    setRefreshing(false);
  }, [refreshing]);

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
