import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const TMDB_API_KEY = "API_KEY";
const MOVIES_BY_CATEGORY_URL = (categoryId) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${categoryId}`;

const FilmesPorCategoriaScreen = () => {
  const route = useRoute();
  const { categoryId } = route.params;
  const [movies, setMovies] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(MOVIES_BY_CATEGORY_URL(categoryId));
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Erro ao buscar filmes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [categoryId]);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Filmes da Categoria</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.movieCard, isDarkMode ? styles.darkCategory : styles.lightCategory]}
              onPress={() => navigation.navigate("Details", { movieId: item.id })}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.movieImage}
              />
              <Text style={[styles.movieText, isDarkMode ? styles.darkText : styles.lightText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
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
    fontSize: 20,
    fontWeight: "bold",
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#000000",
  },
  movieCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  darkCategory: {
    backgroundColor: "#333",
  },
  lightCategory: {
    backgroundColor: "#f0f0f0",
  },
  movieText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
});

export default FilmesPorCategoriaScreen;
