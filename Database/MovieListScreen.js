import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const MovieListScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);

  // Simulated movie data (replace this with your actual data)
  const initialMovies = [
    {
      imdbID: 'tt1457767',
      title: 'Terrible',
      imageUrl: 'https://example.com/movie1.jpg',
    },
    {
      imdbID: 'tt2345678',
      title: 'Funny',
      imageUrl: 'https://example.com/movie2.jpg',
    },

    // Add more movie objects as needed
  ];

  useEffect(() => {
    // Simulate loading movie data (e.g., from an API)
    setTimeout(() => {
      setMovies(initialMovies);
    }, 1000); // Simulate a 1-second delay for loading data
  }, []);

  const handleMoviePress = imdbID => {
    // Navigate to MovieDetails screen and pass the imdbID as a parameter
    navigation.navigate('MovieDetails', {imdbID});
  };

  const handleBannerPress = () => {
    // Log all movie details when the banner is pressed
    console.log('All Movie Details:', movies);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleMoviePress(item.imdbID)}>
      <View style={styles.movieItem}>
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBannerPress}>
        <Image
          source={{uri: 'https://example.com/banner.jpg'}} // Replace with your banner image URL
          style={styles.banner}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Movie List</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={item => item.imdbID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  movieItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});

export default MovieListScreen;
