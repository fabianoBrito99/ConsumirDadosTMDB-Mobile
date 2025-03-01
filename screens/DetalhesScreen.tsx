import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Share, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const TMDB_API_KEY = "API_KEY";
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
const MOVIE_CAST_URL = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface Cast {
  id: number;
  name: string;
  profile_path: string;
}

const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`);
  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do filme");
  }
  return response.json();
};

const fetchMovieCast = async (movieId: number): Promise<Cast[]> => {
  const response = await fetch(MOVIE_CAST_URL(movieId));
  if (!response.ok) {
    throw new Error("Erro ao buscar elenco do filme");
  }
  const data = await response.json();
  return data.cast.slice(0, 10);
};

const DetalhesScreen = ({ route }: any) => {
  const { movieId } = route.params;
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { data: movie, error, isLoading } = useQuery<Movie | undefined>({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovieDetails(movieId),
  });

  const { data: cast, isLoading: castLoading } = useQuery<Cast[]>({
    queryKey: ["movieCast", movieId],
    queryFn: () => fetchMovieCast(movieId),
  });

  const shareMovie = async () => {
    try {
      await Share.share({
        message: `Confira o filme ${movie?.title}! 🎬⭐ ${movie?.vote_average.toFixed(1)}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar", error);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  if (error || !movie) return <Text style={styles.error}>Erro ao carregar os detalhes</Text>;

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.botaoCor}>
        <Text> </Text>
       
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>
      {movie.poster_path && (
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
      )}

        <View style={styles.headerContainer}>
          <Text style={[styles.header, isDarkMode ? styles.darkText : styles.lightText]}>{movie.title}</Text>
          <TouchableOpacity onPress={shareMovie}>
            <Ionicons name="share-outline" size={24} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      <Text style={[styles.subHeader, isDarkMode ? styles.darkText : styles.lightText]}>Sinopse</Text>
      <Text style={[styles.overview, isDarkMode ? styles.darkText : styles.lightText]}>{movie.overview}</Text>
      <Text style={[styles.rating, isDarkMode ? styles.darkText : styles.lightText]}>⭐ {movie.vote_average.toFixed(1)}</Text>
      <Text style={[styles.subHeader, isDarkMode ? styles.darkText : styles.lightText]}>Elenco:</Text>
      {castLoading ? (
        <ActivityIndicator size="small" color="#00ff00" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cast?.map((actor) => (
            <View key={actor.id} style={styles.castContainer}>
              {actor.profile_path ? (
                <Image source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profile_path}` }} style={styles.castImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={60} color={isDarkMode ? "white" : "black"} />
              )}
              <Text style={[styles.castText, isDarkMode ? styles.darkText : styles.lightText]}>{actor.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
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
  botaoCor:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,

  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#000000",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  overview: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  rating: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  castContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  castText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});

export default DetalhesScreen;
