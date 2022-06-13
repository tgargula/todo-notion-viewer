import { RouteProp, useRoute } from "@react-navigation/native";
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
import { getBackgroundColor } from "../styles/default";
import { RootStackParamList } from "../types/types";

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
  const route = useRoute<RouteProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [timerDone, setTimerDone] = useState(false);
  const [notionUrl, setNotionUrl] = useState("");
  const [task, setTask] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const task = await fetchTask(route.params.id);
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

  const [title, ...data] = [
    { label: "Title", value: route.params.title },
    { label: "Category", value: getCategory(route.params.category) },
    { label: "Status", value: task.status },
  ];

  if (task.deadline) {
    data.push({ label: "Deadline", value: task.deadline });
  }

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
