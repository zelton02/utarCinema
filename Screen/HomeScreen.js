import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  BackHandler,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideBars from '../assets/SideBars';
import UserdataScreen from './UserdataScreen';
import TestScreen from '../Database/Usermanagement';
import SQLite from 'react-native-sqlite-storage';
import BottomTab from '../assets/BottomTab';
import MovieListScreen from '../Database/MovieListScreen';
import CinemaHome from './cinemahome';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NowPlaying from '../component/NowPlaying';
import Upcoming from '../component/Upcoming';
import MovieDetail from '../component/MovieDetail';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const moviesOnTrending = [
  {
    title: 'Life Of Game',
    image: require('../images/movie1.jpeg'),
    showtimes: 'Showtimes for Movie 1',
    description:
      'Description for Movie 1. This is a great movie that you must watch!',
  },
];

const HomeScreenContent = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    // Check if user data is present in AsyncStorage
    AsyncStorage.getItem('userData')
      .then(data => {
        if (data) {
          // User data found, indicating an active session
          const userData = JSON.parse(data);
          setUserData(userData);
        } else {
          // No user data found, session has expired, navigate to LoginScreen
          navigation.replace('LoginScreen');
        }
      })
      .catch(error => {
        console.error('Error reading user data from AsyncStorage:', error);
      });

    // Filter movies based on the search query
    if (searchQuery) {
      const filtered = moviesOnTrending.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMovies(filtered);
    } else {
      // If the search query is empty, show all movies
      setFilteredMovies(moviesOnTrending);
    }

    // Add a listener for the hardware back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Show a confirmation dialog and handle the user's response
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => false, // Do nothing when canceled
              style: 'cancel',
            },
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp(), // Exit the app when confirmed
            },
          ],
          {cancelable: false},
        );

        // Return true to prevent the default back button behavior (exit the app)
        return true;
      },
    );

    // Remove the listener when the component unmounts
    return () => backHandler.remove();
  }, [navigation, searchQuery]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const itemWidth = 400; // Width of each movie item
  const totalWidth = itemWidth * filteredMovies.length;

  const handleBannerPress = showtimes => {
    navigation.navigate('ShowtimesScreen', {showtimes});
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
      </View>
      <Text style={styles.sectionTitle}>What's Trending</Text>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: styles.tabLabel,
          style: styles.tabBar,
        }}>
        <Tab.Screen name="Now Playing" component={NowPlaying} />
        <Tab.Screen name="Upcoming Movies" component={Upcoming} />
      </Tab.Navigator>
      <BottomTab navigation={navigation} />
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Drawer.Navigator drawerContent={props => <SideBars {...props} />}>
      <Drawer.Screen name="HomeScreenContent" component={HomeScreenContent} />
      <Drawer.Screen name="Movie List" component={CinemaHome} />
      <Drawer.Screen name="Profiles" component={UserdataScreen} />
      <Drawer.Screen name="MovieList" component={MovieListScreen} />
      <Drawer.Screen
        name="TestScreen Database for User"
        component={TestScreen}
      />
      {/* Add other screens to the drawer as needed */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Change text color to dark gray
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  searchInput: {
    width: 150,
    height: 40,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 20,
    paddingLeft: 10,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0, // Remove shadow on Android
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  // Add more styles as needed
});

export default HomeScreen;
