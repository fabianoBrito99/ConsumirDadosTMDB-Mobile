import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";

const TMDB_API_KEY = "Chave-api"; //coloque a chave api para funcionar
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`);
  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do filme");
  }
  return response.json();
};

const DetalhesScreen = ({ route }: any) => {
  const { movieId } = route.params;
  
  // Agora tipamos corretamente a resposta do useQuery para evitar erros
  const { data: movie, error, isLoading } = useQuery<Movie | undefined>({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovieDetails(movieId),
  });

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  if (error || !movie) return <Text style={styles.error}>Erro ao carregar os detalhes</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{movie.title}</Text>
      {movie.poster_path && (
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
      )}
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
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
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});

export default DetalhesScreen;
