import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TaskGroupList } from "./components/TaskGroupList";
import { TaskDetails } from "./components/TaskDetails";
import { RootStackParamList } from "./types/types";
import { StorageProvider } from "./hooks/storageProvider";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StorageProvider>
        {/* @ts-ignore */}
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#03e" },
            headerTintColor: "#fff",
          }}
        >
          <Stack.Screen
            name="Home"
            component={TaskGroupList}
            options={{ title: "Tasks" }}
          />
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetails}
            options={{ title: "Details" }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </StorageProvider>
    </NavigationContainer>
  );
}
