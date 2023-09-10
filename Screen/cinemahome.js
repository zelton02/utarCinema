import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Showtime from './Showtime';
import {useNavigation} from '@react-navigation/native';

const CinemaHome = ({navigation}) => {
  const [movieIMDbIDs, setMovieIMDbIDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieList, setMovieList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to save movie details to AsyncStorage
  const saveMovieDetailsToStorage = async (imdbID, movieDetails) => {
    try {
      // Serialize the movieDetails object to JSON
      const movieDetailsJSON = JSON.stringify(movieDetails);
      // Use imdbID as the key to save the data
      await AsyncStorage.setItem(imdbID, movieDetailsJSON);
      console.log('Movie details saved to AsyncStorage:', imdbID);
    } catch (error) {
      console.error('Error saving movie details to AsyncStorage:', error);
    }
  };

  // Function to fetch movie details by IMDb ID and store them in AsyncStorage
  const fetchAndStoreMovieDetails = async imdbID => {
    const apiKey = '50b7414609msh928fe6108edc4edp18c29ajsna7ecffa45322';

    const url = `https://online-movie-database.p.rapidapi.com/title/get-details?tconst=${imdbID}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const movieDetails = await response.json();

      if (movieDetails) {
        // Save movie details to AsyncStorage
        saveMovieDetailsToStorage(imdbID, movieDetails);
      }
    } catch (error) {
      console.error(
        'Error fetching and storing movie details for IMDb ID:',
        imdbID,
        error,
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url =
        'https://imdb8.p.rapidapi.com/title/v2/get-popular-movies-by-genre?genre=action&limit=2';
      const apiKey = '50b7414609msh928fe6108edc4edp18c29ajsna7ecffa45322';

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          return;
        }

        // Extract IMDb IDs from the response
        const imdbIDs = data
          .map(item => {
            const matches = item.match(/\/title\/(tt\d+)\//);
            return matches ? matches[1] : null;
          })
          .filter(Boolean);

        setMovieIMDbIDs(imdbIDs);
        setLoading(false);
        console.log('Movie IMDb IDs:', imdbIDs);

        // Save the fetched data to AsyncStorage
        await AsyncStorage.setItem('movieData', JSON.stringify(data));
        console.log('Fetched data saved to AsyncStorage');

        // Fetch and store movie details for each IMDb ID
        imdbIDs.forEach(fetchAndStoreMovieDetails);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMovieList = async imdbIDs => {
      const apiKey = '50b7414609msh928fe6108edc4edp18c29ajsna7ecffa45322';

      const detailsPromises = imdbIDs.map(async imdbID => {
        const url = `https://imdb8.p.rapidapi.com/auto-complete?q=${imdbID}`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
          },
        };

        try {
          const response = await fetch(url, options);
          const data = await response.json();

          if (Array.isArray(data.d)) {
            const movieDetails = data.d.find(item => item.i?.imageUrl);
            if (movieDetails) {
              // Save movie details to AsyncStorage
              saveMovieDetailsToStorage(imdbID, movieDetails);
              return movieDetails;
            }
          } else {
            console.error(
              'No movies found in the response for IMDb ID:',
              imdbID,
            );
            return null;
          }
        } catch (error) {
          console.error(
            'Error fetching movie details for IMDb ID:',
            imdbID,
            error,
          );
          return null;
        }
      });

      const movieDetailsData = await Promise.all(detailsPromises);
      const filteredMovieList = movieDetailsData.filter(item => item !== null);
      setMovieList(filteredMovieList);
    };

    fetchMovieList(movieIMDbIDs);
  }, [movieIMDbIDs]);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      if (movieIMDbIDs.length === 0) {
        return;
      }

      setMovieList([]);
    } else {
      const filteredMovies = movieList.filter(movie => {
        const title = movie.l.toLowerCase();
        return title.includes(searchQuery.toLowerCase());
      });

      setMovieList(filteredMovies);
    }
  };

  const handleMoviePress = selectedMovie => {
    const movie = movieList.find(movie => movie.id === selectedMovie);
    const imageURL = movie?.i?.imageUrl;
    const movieName = movie.l;

    console.log('Selected Movie Data:', selectedMovie);
    console.log('Selected Movie Name:', movieName); // Log the movie name
    console.log('Selected Movie Image URL:', imageURL); // Log the imageURL

    navigation.navigate('Showtime', {selectedMovie, imageURL, movieName});
  };

  const renderItem = ({item}) => {
    console.log('Image URL:', item.i?.imageUrl);
    console.log('Inside item.l', item.l);
    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => handleMoviePress(item.id, item.l)}>
        <Image source={{uri: item.i?.imageUrl}} style={styles.movieImage} />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{item.l}</Text>
          <Text style={styles.movieIMDbID}>IMDb ID: {item.id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={movieList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  movieInfo: {
    marginLeft: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieIMDbID: {
    fontSize: 14,
    color: 'gray',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    marginRight: 8,
    paddingHorizontal: 8,
  },
  searchButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CinemaHome;
