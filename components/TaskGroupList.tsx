import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  View,
  RefreshControl,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { fetchTasks } from "../actions/fetchTasks";
import { getTextColor } from "../styles/default";
import { renderTaskGroup, TaskGroupProps } from "./TaskGroup";

export function TaskGroupList() {
  const [tasks, setTasks] = useState<TaskGroupProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const scheme = useColorScheme();

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
      <View style={styles.view}>
        <Text
          style={[
            styles.error,
            { color: getTextColor(scheme) }
          ]}
        >
          An error occured ❌
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
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
  view: {
    flex: 1,
  },
  error: {
    marginTop: 16,
    alignSelf: "center",
  },
});
