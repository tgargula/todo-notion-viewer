import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
import { statusOrder } from "../services/notion/config";
import { NotionService } from "../services/notion/notion.service";
import { getBackgroundColor } from "../styles/default";
import { Category, Status } from "../types/types";

const getStatusColor = (status: Status | null, idx: number) => {
  if (!status) return undefined;

  if (statusOrder[status] === idx) {
    return "#03e";
  }

  if (statusOrder[status] > idx) {
    return "#0af";
  }

  return undefined;
};

const getBorderRadius = (idx: number) => {
  return {
    borderBottomStartRadius: idx === 0 ? 16 : 0,
    borderTopStartRadius: idx === 0 ? 16 : 0,
    borderTopEndRadius: idx === 3 ? 16 : 0,
    borderBottomEndRadius: idx === 3 ? 16 : 0,
  };
};

type Props = {
  id: string;
  category: Category;
  status?: Status;
};

export function StatusBar({ id, category, status }: Props) {
  const notion = new NotionService();
  const [currentStatus, setCurrentStatus] = useState<Status | null>(
    status ?? null
  );
  const [isLoading, setIsLoading] = useState(false);

  const statusList: Array<Status> = ["Backlog", "To do", "In progress", "Done"];

  return (
    <View>
      <Text>Status</Text>
      <View style={styles.container}>
        {statusList.map((name, idx) => (
          <View
            key={name}
            style={[
              styles.item,
              {
                ...getBorderRadius(idx),
                backgroundColor: getStatusColor(currentStatus, idx),
              },
              { opacity: isLoading ? 0.5 : 1 },
            ]}
          >
            <TouchableHighlight
              style={[styles.button, getBorderRadius(idx)]}
              underlayColor="#03e"
              disabled={isLoading}
              onPress={async () => {
                setIsLoading(true);
                try {
                  setCurrentStatus(name);
                  await notion.updateStatus({ taskId: id, status: name }, category)
                  ToastAndroid.show(
                    "Successfully changed the task status!",
                    ToastAndroid.SHORT
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <Text style={styles.text}>{name}</Text>
            </TouchableHighlight>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 64,
    margin: 16,
    borderRadius: 16,
    backgroundColor: getBackgroundColor("light"),
  },
  item: {
    flex: 1,
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});
