import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';

const databaseName = 'CinemaHallDB.db';
const database = SQLite.openDatabase({name: databaseName, location: 'default'});

database.transaction(tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS SeatDB (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      row INT,
      col INT,
      isBooked BOOLEAN
    );`,
  );
});

const SeatScreen = ({route, navigation}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Access the route params from the Showtime Screen
  const {movieName, selectedDate, selectedShowtime} = route.params;
  // Log the received data to validate
  console.log('Received Movie Name:', movieName);
  console.log('Received Date:', selectedDate);
  console.log('Received Showtime:', selectedShowtime);
  const handleConfirmSeats = () => {
    if (selectedSeats.length > 0) {
      Alert.alert(
        'Confirm Seats',
        'Are you sure you want to confirm these seats?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              // Pass data to PaymentScreen and navigate
              navigation.navigate('PaymentScreen', {
                movieName,
                selectedDate,
                selectedShowtime,
                bookedSeats: selectedSeats, // Pass booked seats data
              });
            },
          },
        ],
      );
    } else {
      Alert.alert('Alert', 'Please select at least one seat.');
    }
  };

  const toggleSeatSelection = (row, col) => {
    const seatID = `${row}-${col}`;
    if (selectedSeats.includes(seatID)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatID));
    } else {
      setSelectedSeats([...selectedSeats, seatID]);
    }
  };

  const generateRow = (row, numberOfSeats) => {
    const seats = [];
    for (let col = 1; col <= numberOfSeats; col++) {
      const seatID = `${row}-${col}`;
      const isSelected = selectedSeats.includes(seatID);
      seats.push(
        <TouchableOpacity
          key={seatID}
          onPress={() => toggleSeatSelection(row, col)}
          style={[
            styles.seat,
            isSelected ? styles.selectedSeat : styles.availableSeat,
          ]}>
          <Text style={styles.seatText}>{col}</Text>
        </TouchableOpacity>,
      );
    }
    return (
      <View key={row} style={styles.seatRow}>
        <Text style={styles.rowText}>{String.fromCharCode(row + 64)}</Text>
        {seats}
      </View>
    );
  };

  const numberOfSeats = 8;
  const numberOfRows = 5;

  const rows = [];
  for (let row = 1; row <= numberOfRows; row++) {
    rows.push(generateRow(row, numberOfSeats));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hallText}>Hall-1</Text>
      <View style={styles.screen}>
        <Text style={styles.screenText}>Screen</Text>
      </View>
      <View>{rows}</View>
      {/* Add the CONFIRM SEATS button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmSeats}>
        <Text style={styles.confirmButtonText}>CONFIRM SEATS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  hallText: {
    color: 'white',
    fontSize: 30,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  screenText: {
    color: 'white',
    fontSize: 18,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  seat: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  availableSeat: {
    backgroundColor: 'green',
  },
  selectedSeat: {
    backgroundColor: 'red',
  },
  seatText: {
    color: 'white',
    fontSize: 14,
  },
  rowText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  confirmButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignSelf: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default SeatScreen;
