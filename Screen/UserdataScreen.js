import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from '../assets/BottomTab';

const UserdataScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);

  // Define a function to log the user out
  const handleLogout = async () => {
    try {
      // Clear the user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      // Clear the userData state
      setUserData(null);
      // Reset the navigation stack to the LoginScreen
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../images/usericon.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>
          user: {userData ? userData.email : ''}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AccountDetails', {userEmail: userData.email})
          }>
          <Text style={styles.sectionTitle}>Account Details</Text>
          {/* Display user account details here */}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BookingHistory', {})}>
          <Text style={styles.sectionTitle}>Booking History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => navigation.navigate('Aboutus')}>
          <Text style={styles.sectionTitle}>About Us</Text>
          {/* Display information about your app or organization */}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Bottom Task Bar */}
      <View style={styles.taskBar}>
        <BottomTab navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: 'black', // Set background color to black
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2, // Add a border width
    borderColor: 'gray', // Specify the border color
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Set text color to white
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1, // Add a thin border line
    borderBottomColor: 'white', // Specify the border color
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // Set text color to white
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  taskBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskBarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserdataScreen;
