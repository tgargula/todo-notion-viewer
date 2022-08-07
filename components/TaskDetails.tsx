import { RouteProp, useRoute } from "@react-navigation/native";
import { format, formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Linking,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fetchTask } from "../actions/fetchTasks";
import { NotionService } from "../services/notion/notion.service";
import { FetchOneResponse } from "../services/notion/types/response.type";
import { getBackgroundColor } from "../styles/default";
import { Category, RootStackParamList } from "../types/types";
import { formatDeadline } from "../utils/formatDeadline";

type RouteProps = RouteProp<RootStackParamList, "TaskDetails">;

const getCategory = (category: string) => {
  switch (category) {
    case "personal":
      return "Personal";
    case "bit":
      return "Scientific Group";
    case "beng":
      return "Engineering Thesis";
    default:
      return "Other";
  }
};

const renderItem = ({
  item: { label, value },
}: {
  item: { label: string; value: string };
}) => (
  <View style={styles.property}>
    <Text>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export function TaskDetails() {
  const notion = new NotionService();
  const route = useRoute<RouteProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [timerDone, setTimerDone] = useState(false);
  const [notionUrl, setNotionUrl] = useState("");
  const [task, setTask] = useState<FetchOneResponse | null>(null);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const task = await notion.fetchOneByCategory(
        { id: route.params.id },
        route.params.category as Category
      );
      setTask(task);
      setNotionUrl(task.url);
      setIsLoading(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTimerDone(true);
    }, 600);
    onRefresh();

    return () => clearTimeout(timerId);
  }, []);

  const handlePress = useCallback(() => {
    Linking.openURL(notionUrl);
  }, [notionUrl]);

  if (isLoading || !timerDone) {
    return <Text style={styles.loading}>The task is loading</Text>;
  }

  const deadline = formatDeadline(task?.deadline);
  const [title, ...data] = [
    { label: "Title", value: task?.title },
    { label: "Category", value: task?.category && getCategory(task.category) },
    { label: "Status", value: task?.status },
    {
      label: "Deadline",
      value:
        deadline &&
        `${format(deadline, "yyyy-MM-dd, HH:mm:ss")} (${formatDistance(
          deadline,
          new Date(),
          { addSuffix: true }
        )})`,
    },
    {
      label: "Created At",
      value:
        task?.createdAt &&
        `${format(task.createdAt, "yyyy-MM-dd, HH:mm:ss")} (${formatDistance(
          task.createdAt,
          new Date(),
          { addSuffix: true }
        )})`,
    },
    {
      label: "Updated At",
      value:
        task?.updatedAt &&
        `${format(task.updatedAt, "yyyy-MM-dd, HH:mm:ss")} (${formatDistance(
          task.updatedAt,
          new Date(),
          { addSuffix: true }
        )})`,
    },
    { label: "Priority", value: task?.priority },
    { label: "Cost", value: task?.cost },
    { label: "Tags", value: task?.tags?.join(", ") },
  ].filter(({ value }) => value) as Array<{ label: string; value: string }>;

  return (
    <View style={styles.layout}>
      <View style={styles.spaceBetween}>
        {renderItem({ item: title })}
        <TouchableOpacity
          style={styles.button}
          disabled={!notionUrl}
          onPress={handlePress}
        >
          <Image style={styles.icon} source={require("../assets/notion.png")} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: getBackgroundColor("light"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  loading: {
    marginTop: 16,
    alignSelf: "center",
  },
  property: {
    marginBottom: 16,
    flexShrink: 1,
  },
  value: {
    fontWeight: "600",
    fontSize: 18,
  },
  layout: {
    margin: 16,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
