import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';

const MovieDetail = ({route}) => {
  // Extract the movie object from the route params
  const {movie} = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`}}
        style={styles.movieImage}
      />
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Text style={styles.movieOverview}>{movie.overview}</Text>
      <Text style={styles.movieReleaseDate}>
        Release Date: {movie.release_date}
      </Text>
      <Text style={styles.movieVoteAverage}>
        Average Vote: {movie.vote_average}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  movieImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  movieOverview: {
    fontSize: 16,
    marginTop: 10,
  },
  movieReleaseDate: {
    fontSize: 14,
    marginTop: 10,
  },
  movieVoteAverage: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default MovieDetail;
