import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TmdbScreen from "./screens/tmdb";
import DetalhesScreen from "./screens/DetalhesScreen";

const Stack = createStackNavigator();
const queryClient = new QueryClient(); 

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Search" component={TmdbScreen} />
          <Stack.Screen name="Details" component={DetalhesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
