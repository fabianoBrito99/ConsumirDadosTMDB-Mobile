import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

// Importação das telas
import TmdbScreen from "./screens/tmdb";
import DetalhesScreen from "./screens/DetalhesScreen";
import CategoriasScreen from "./screens/listarCategoria";
import FilmesPorCategoriaScreen from "./screens/filmesPorCategoria";
import HomeScreen from "./screens/homeScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

// Stack Navigator global
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetalhesScreen} />
    </Stack.Navigator>
  );
}

// Stack para filmes e categorias
function CategoriasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoriasMain" component={CategoriasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FilmesPorCategoria" component={FilmesPorCategoriaScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator para a navegação fixa na parte inferior
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Pesquisar") {
            iconName = "search-outline";
          } else if (route.name === "Categorias") {
            iconName = "grid-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pesquisar" component={TmdbScreen} />
      <Tab.Screen name="Categorias" component={CategoriasStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Componente principal
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
