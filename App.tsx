import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TaskGroupList } from "./components/TaskGroupList";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#121212",
          text: "#fff",
          primary: "#03e",
        },
      }}
    >
      {/* @ts-ignore */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#03e" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="Tasks" component={TaskGroupList} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
