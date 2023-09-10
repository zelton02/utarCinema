import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../images/applogo.png')} style={styles.logo} />
      <Text style={styles.heading}>About Our App</Text>
      <Text style={styles.description}>
        Welcome to our app! More features will be adding soon.
      </Text>
      {/* You can add more text and images here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AboutUs;
