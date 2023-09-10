import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {fetchNowPlayingMovies} from '../Database/api'; // Import the API function
import MovieDetail from './MovieDetail';

const NowPlaying = ({navigation}) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch now playing movies when the component mounts
    fetchNowPlayingMovies()
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error('Error fetching now playing movies:', error);
      });
  }, []);

  const handleMovieCardPress = movie => {
    // Navigate to the MovieDetail screen with the entire movie object as a parameter
    navigation.navigate('MovieDetail', {movie});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() => handleMovieCardPress(item)}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`}}
        style={styles.movieImage}
      />
      <Text style={styles.movieName}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={movies.map((item, index) => ({...item, index}))}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={3}
    />
  );
};

const styles = StyleSheet.create({
  movieContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieName: {
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 100,
  },
});

export default NowPlaying;
