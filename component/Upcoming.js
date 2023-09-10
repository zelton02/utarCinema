// Upcoming.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {fetchUpcomingMovies} from '../Database/api'; // Import the API function

const Upcoming = ({navigation}) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch upcoming movies when the component mounts
    fetchUpcomingMovies()
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error('Error fetching upcoming movies:', error);
      });
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() => navigation.navigate('MovieDetail', {movie: item})}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`}}
        style={styles.movieImage}
      />
      <Text style={styles.movieName}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={movies}
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

export default Upcoming;
