import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const TMDB_API_KEY = "API_KEY";
const CATEGORIES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`;

interface Genre {
  id: number;
  name: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Ação": "flame-outline",
  "Comédia": "happy-outline",
  "Drama": "help-circle-outline",
  "Terror": "skull-outline",
  "Romance": "heart-outline",
  "Ficção Científica": "planet-outline",
  "Fantasia": "sparkles-outline",
  "Animação": "film-outline",
  "Documentário": "videocam-outline",
  "Suspense": "eye-outline",
};

// Cores para cada categoria
const categoryColors: Record<number, string> = {
  28: "#FF5733", // Ação - Vermelho Alaranjado
  35: "#FFC300", // Comédia - Amarelo
  18: "#C70039", // Drama - Vermelho Escuro
  27: "#900C3F", // Terror - Roxo Escuro
  10749: "#FF69B4", // Romance - Rosa
  878: "#00C7FF", // Ficção Científica - Azul Claro
  14: "#8E44AD", // Fantasia - Roxo
  16: "#3498DB", // Animação - Azul
  99: "#1ABC9C", // Documentário - Verde Água
  53: "#E67E22", // Suspense - Laranja
};

const CategoriasScreen = () => {
  const [categories, setCategories] = useState<Genre[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_URL);
        const data = await response.json();
        const categoriesWithIcons = data.genres.map((genre: Genre) => ({
          ...genre,
          icon: categoryIcons[genre.name] || "film-outline",
        }));

        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Categorias</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* Lista de Categorias */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => {
          const backgroundColor = categoryColors[item.id] || "#777777"; // Cor padrão se a categoria não estiver na lista

          return (
            <TouchableOpacity
              style={[
                styles.category,
                { backgroundColor },
                isDarkMode ? styles.darkBorder : styles.lightBorder,
              ]}
              onPress={() => navigation.navigate("FilmesPorCategoria", { categoryId: item.id })}
            >
              <Ionicons name={item.icon} size={32} color="white" />
              <Text style={[styles.categoryText, { color: "white" }]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#000000",
  },
  category: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  darkBorder: {
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  lightBorder: {
    borderWidth: 2,
    borderColor: "#000000",
  },
  categoryText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default CategoriasScreen;
