import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearBookingHistory = async () => {
  try {
    await AsyncStorage.removeItem('bookingHistory'); // Remove the 'bookingHistory' key
    console.log('Booking history cleared successfully');
  } catch (error) {
    console.error('Error clearing booking history:', error);
  }
};
//clearBookingHistory();
const BookingHistory = () => {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    // Retrieve booking history data from AsyncStorage
    AsyncStorage.getItem('bookingHistory')
      .then(data => {
        if (data) {
          const storedData = JSON.parse(data);
          setBookingData(storedData); // Set the retrieved data directly
          console.log(
            'Booking history data retrieved successfully:',
            storedData,
          );
        } else {
          console.log('No booking history data found in AsyncStorage');
        }
      })
      .catch(error => {
        console.error('Error retrieving booking history data:', error);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      {bookingData.map((booking, index) => (
        <View key={index} style={styles.bookingContainer}>
          <Text style={styles.bookingTitle}>Booking {index + 1}</Text>
          <Text style={styles.whiteText}>Movie Name: {booking.movieName}</Text>
          <Text style={styles.whiteText}>Date: {booking.selectedDate}</Text>
          <Text style={styles.whiteText}>
            Showtime: {booking.selectedShowtime}
          </Text>
          <Text style={styles.whiteText}>
            Booked Seats:{' '}
            {booking.bookedSeats
              ? booking.bookedSeats.join(', ')
              : 'No seats booked'}
          </Text>
        </View>
      ))}
      {bookingData.length === 0 && (
        <Text style={[styles.noHistoryText, styles.whiteText]}>
          No booking history available
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'black', // Set background color to black
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // Set text color to white
  },
  bookingContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'black', // Set background color to black
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // Set text color to white
  },
  whiteText: {
    color: 'white', // Set text color to white
  },
  noHistoryText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 20,
  },
});

export default BookingHistory;
