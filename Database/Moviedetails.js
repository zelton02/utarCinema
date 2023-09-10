import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const MovieListScreen = ({navigation}) => {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    const fetchMovieList = async () => {
      const apiKey = '6aefb093f0msha4ebad891a3e5b8p1ef220jsn62b60d914ef1'; // Replace with your API key
      const query = 'b';
      const url = `https://imdb8.p.rapidapi.com/auto-complete?q=${query}`;

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Check if the data contains movies
        if (Array.isArray(data.d)) {
          setMovieList(data.d.filter(item => item.i?.imageUrl)); // Filter items with imageUrl property
        } else {
          console.error('No movies found in the response:', data);
        }
      } catch (error) {
        console.error('Error fetching movie list:', error);
      }
    };

    fetchMovieList();
  }, []);

  const handleMoviePress = imdbID => {
    // Navigate to MovieDetails screen with the movie ID
    navigation.navigate('MovieDetails', {imdbID});

    // Log movie details to the console
    const selectedMovie = movieList.find(movie => movie.id === imdbID);
    if (selectedMovie) {
      console.log('Movie Details:', selectedMovie);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => handleMoviePress(item.id)}>
        <Image source={{uri: item.i?.imageUrl}} style={styles.movieImage} />
        <Text style={styles.movieTitle}>{item.l}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={movieList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  movieImage: {
    width: 80,
    height: 100,
    resizeMode: 'cover',
  },
  movieTitle: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default MovieListScreen;
