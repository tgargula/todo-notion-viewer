import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { fetchTasks } from "../actions/fetchTasks";
import { TaskGroupProps } from "../components/TaskGroup";
import useStorage from "./useStorage";

const useTasks = () => {
  const [tasks, setTasks] = useState<{
    data: TaskGroupProps[];
    lastUpdatedAt: Date | null;
  }>({ data: [], lastUpdatedAt: null });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const { setItem, getItem } = useStorage();

  useEffect(() => {
    (async () => {
      await onRender();
      onRefresh();
    })();
  }, []);

  const onRender = useCallback(async () => {
    const tasks = await getItem("tasks");

    if (!tasks) return;
    setTasks(tasks);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(false);
    try {
      const fetchedTasks = await fetchTasks();
      setItem("tasks", fetchedTasks);
      setTasks({ data: fetchedTasks, lastUpdatedAt: new Date() });
    } catch (err) {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  return { tasks, error, refreshing, onRefresh };
};

export default useTasks;
