import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const TMDB_API_KEY = "API_KEY";
const FEATURED_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR`;
const UPCOMING_MOVIES_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=pt-BR`;
const CATEGORIES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Buscar filmes em destaque
  const { data: featuredMovies, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featuredMovies"],
    queryFn: async () => {
      const res = await fetch(FEATURED_MOVIES_URL);
      const json = await res.json();
      return json.results.slice(0, 10);
    },
  });

  // Buscar próximos lançamentos
  const { data: upcomingMovies, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: async () => {
      const res = await fetch(UPCOMING_MOVIES_URL);
      const json = await res.json();
      return json.results;
    },
  });

  // Buscar categorias e filmes por categoria
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_URL);
        const data = await response.json();
        setCategories(data.genres);

        // Buscar filmes por categoria
        const categoryData = {};
        for (const category of data.genres) {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${category.id}`
          );
          const json = await response.json();
          categoryData[category.id] = json.results.slice(0, 10);
        }
        setCategoryMovies(categoryData);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };

    fetchCategories();
  }, []);

  // Alternar destaque automaticamente a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredMovies) {
        setFeaturedIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header - Alternância de Tema */}
      <View style={styles.header}>
        <Text style={[styles.headerText, isDarkMode ? styles.darkText : styles.lightText]}>🎬 Home</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* Seção de Destaque */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>🔥 Filmes em Destaque</Text>
        {loadingFeatured ? (
          <ActivityIndicator size="large" color="#ff0000" />
        ) : (
          featuredMovies && featuredMovies.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate("Details", { movieId: featuredMovies[featuredIndex].id })}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${featuredMovies[featuredIndex].poster_path}` }}
                style={styles.featuredImage}
              />
              <Text style={[styles.featuredTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                {featuredMovies[featuredIndex].title}
              </Text>
              <Text style={[styles.featuredSubText, isDarkMode ? styles.darkText : styles.lightText]}>
                ⭐ {featuredMovies[featuredIndex].vote_average.toFixed(1)} | 📅 {featuredMovies[featuredIndex].release_date.split("-")[0]}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Seção de Próximos Lançamentos */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>🎥 Próximos Lançamentos</Text>
        {loadingUpcoming ? (
          <ActivityIndicator size="large" color="#ff0000" />
        ) : (
          <FlatList
            data={upcomingMovies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate("Details", { movieId: item.id })}>
                <View style={styles.movieCard}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.movieImage} />
                  <Text style={[styles.movieTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Seções de Filmes por Categoria */}
      {categories.map((category) => (
        <View key={category.id} style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}> {category.name}</Text>
          <FlatList
            data={categoryMovies[category.id]}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate("Details", { movieId: item.id })}>
                <View style={styles.movieCard}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.movieImage} />
                  <Text style={[styles.movieTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: "#ffffff" },
  darkContainer: { backgroundColor: "#121212" },
  darkText: { color: "#ffffff" },
  lightText: { color: "#000000" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20 },
  headerText: { fontSize: 24, fontWeight: "bold" },
  section: { marginVertical: 20, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  featuredImage: { width: "100%", height: 400, borderRadius: 10 },
  featuredTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  featuredSubText: { fontSize: 16, textAlign: "center", marginTop: 5 },
  movieCard: { marginRight: 10, alignItems: "center" },
  movieImage: { width: 120, height: 180, borderRadius: 8 },
  movieTitle: { fontSize: 14, textAlign: "center", marginTop: 5 },
});

export default HomeScreen;
