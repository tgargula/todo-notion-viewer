import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { NotionService } from "../services/notion/notion.service";
import { FetchAllResponse } from "../services/notion/types/response.type";
import useStorage from "./useStorage";

const useTasks = () => {
  const notion = new NotionService();
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<{
    data: FetchAllResponse;
    lastUpdatedAt: Date | null;
  }>({ data: [], lastUpdatedAt: null });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [showBacklog, setShowBacklog] = useState(false);
  const { setItem, getItem } = useStorage();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => onRefresh(showBacklog));
    (async () => {
      await onRender();
      onRefresh(showBacklog);
    })();
    return unsubscribe;
  }, []);

  const onRender = useCallback(async () => {
    const tasks = await getItem("tasks");

    if (!tasks) return;
    setTasks(tasks);
  }, []);

  const onRefresh = useCallback(async (showBacklog: boolean) => {
    setRefreshing(true);
    setError(false);
    try {
      const fetchedTasks = await notion.fetchAllTasks(showBacklog);
      await setItem("tasks", fetchedTasks);
      setTasks({ data: fetchedTasks, lastUpdatedAt: new Date() });
    } catch (err) {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  return { tasks, error, refreshing, onRefresh, showBacklog, setShowBacklog };
};

export default useTasks;
