import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
} from "react-native";
import useTasks from "../hooks/useTasks";
import { EmptyListComponent } from "./EmptyListComponent";
import { renderTaskGroup } from "./TaskGroup";

export function TaskGroupList() {
  const { tasks, error, refreshing, onRefresh, showBacklog, setShowBacklog } =
    useTasks();

  return (
    <View style={styles.view}>
      <View style={styles.switchView}>
        <Text>Show backlog?</Text>
        <Switch
          value={showBacklog}
          onChange={() => {
            setShowBacklog((previousValue) => {
              onRefresh(!previousValue);
              return !previousValue;
            });
          }}
          thumbColor="#03e"
          trackColor={{ true: "#223" }}
        />
      </View>
      <FlatList
        data={tasks.data}
        renderItem={(item) => renderTaskGroup(item, tasks.lastUpdatedAt)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(showBacklog)} />
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
  switchView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
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
