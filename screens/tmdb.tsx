import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

const TMDB_API_KEY = "API_KEY"; //coloque a chave api para funcionar
const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const response = await fetch(`${SEARCH_API_URL}${query}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar os filmes");
  }
  const data = await response.json();
  return data.results;
};

const TmdbScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const { data: movies, error, isLoading, refetch } = useQuery({
    queryKey: ["searchMovies", query],
    queryFn: () => fetchMovies(query),
    enabled: false,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buscar Filmes</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={query}
        onChangeText={setQuery}
      />
      <View >
        <Button title="Buscar" onPress={() => refetch()} />
      
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {error && <Text>Erro ao buscar filmes</Text>}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Details", { movieId: item.id })}>
            <View style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.image}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.releaseDate}>📅 {item.release_date}</Text>
              <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TmdbScreen;

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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  greenButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  greenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  releaseDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
