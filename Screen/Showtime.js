import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {Alert} from 'react-native';

// Import navigation from your navigation library (e.g., React Navigation)
import {useNavigation} from '@react-navigation/native';

const Showtime = ({route}) => {
  const {imageURL, movieName} = route.params;
  const todayDate = moment().format('DD');
  const todayDay = moment().format('ddd');

  const nextDate1 = moment().add(1, 'days').format('DD');
  const nextDay1 = moment().add(1, 'days').format('ddd');
  const nextDate2 = moment().add(2, 'days').format('DD');
  const nextDay2 = moment().add(2, 'days').format('ddd');

  // Showtimes for each day
  const showtimes = {
    [todayDate]: [
      '10:30 AM',
      '01:15 PM',
      '03:00 PM',
      '04:00 PM',
      '05:30 AM',
      '07:15 PM',
      '09:00 PM',
      '10:00 PM',
    ],
    [nextDate1]: ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM', '10:00 PM'],
    [nextDate2]: ['09:45 AM', '12:30 PM', '03:15 PM', '05:30 PM', '08:30 PM'],
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const navigation = useNavigation(); // Initialize navigation

  const handleDateButtonPress = date => {
    setSelectedDate(date === selectedDate ? null : date);
    setSelectedShowtime(null); // Clear selected showtime when date changes
  };

  const handleShowtimePress = showtime => {
    setSelectedShowtime(showtime === selectedShowtime ? null : showtime);
  };

  const handleSelectSeat = () => {
    if (selectedDate && selectedShowtime) {
      Alert.alert(
        'Confirm Seat',
        `Do you want to book a seat for ${movieName} on ${selectedDate} at ${selectedShowtime}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              // Log the selected data
              console.log('Selected Movie Name:', movieName);
              console.log('Selected Date:', selectedDate);
              console.log('Selected Showtime:', selectedShowtime);

              // Navigate to the SeatScreen.js with data
              navigation.navigate('SeatScreen', {
                movieName: movieName,
                selectedDate: selectedDate,
                selectedShowtime: selectedShowtime,
              });
            },
          },
        ],
      );
    } else {
      Alert.alert('Alert', 'Please select a date and showtime.');
    }
  };

  return (
    <View style={styles.container}>
      {imageURL ? (
        <View style={styles.contentContainer}>
          <Image source={{uri: imageURL}} style={styles.movieImage} />
          <Text style={styles.movieTitle}>{movieName}</Text>

          <View style={styles.dateButtonContainer}>
            <DateButton
              date={todayDate}
              day={todayDay}
              onPress={handleDateButtonPress}
              selected={selectedDate === todayDate}
            />
            <DateButton
              date={nextDate1}
              day={nextDay1}
              onPress={handleDateButtonPress}
              selected={selectedDate === nextDate1}
            />
            <DateButton
              date={nextDate2}
              day={nextDay2}
              onPress={handleDateButtonPress}
              selected={selectedDate === nextDate2}
            />
          </View>

          <Text style={styles.availableTimeslotText}>Available Timeslot</Text>

          {selectedDate && (
            <ShowtimesList
              showtimes={showtimes[selectedDate]}
              onPress={handleShowtimePress}
              selectedShowtime={selectedShowtime}
            />
          )}

          <TouchableOpacity
            style={styles.selectSeatButton}
            onPress={handleSelectSeat}>
            <Text style={styles.selectSeatButtonText}>SELECT SEAT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noImageText}>No image available</Text>
      )}
    </View>
  );
};

// DateButton component
const DateButton = ({date, day, onPress, selected}) => {
  return (
    <TouchableOpacity
      style={[styles.dateButton, selected && styles.selectedDateButton]}
      onPress={() => onPress(date)}>
      <Text style={[styles.dateText, selected && styles.selectedDateText]}>
        {date}
      </Text>
      <Text style={styles.dayText}>{day}</Text>
    </TouchableOpacity>
  );
};

const ShowtimesList = ({showtimes, onPress, selectedShowtime}) => {
  const columns = [];
  let column = [];

  showtimes.forEach((time, index) => {
    if (index > 0 && index % 4 === 0) {
      columns.push(column);
      column = [];
    }
    column.push(time);
  });

  // Push the remaining showtimes if not evenly divisible by 4
  if (column.length > 0) {
    columns.push(column);
  }

  return (
    <View style={styles.showtimesListContainer}>
      {columns[0].map((_, columnIndex) => (
        <View key={columnIndex} style={styles.showtimeColumn}>
          {columns.map((showtimeColumn, rowIndex) => (
            <TouchableOpacity
              key={rowIndex}
              style={[
                styles.showtimeItem,
                selectedShowtime === showtimeColumn[columnIndex] &&
                  styles.selectedShowtimeItem,
              ]}
              onPress={() => onPress(showtimeColumn[columnIndex])}>
              <Text
                style={[
                  styles.showtimeText,
                  selectedShowtime === showtimeColumn[columnIndex] &&
                    styles.selectedShowtimeText,
                ]}>
                {showtimeColumn[columnIndex]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  availableTimeslotText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10, // Add margin for spacing
  },

  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  contentContainer: {
    alignItems: 'center',
  },
  movieImage: {
    width: 130,
    height: 200,
    resizeMode: 'cover',
  },
  movieTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noImageText: {
    color: 'white',
    fontSize: 16,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    margin: 8,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  selectedDateButton: {
    backgroundColor: '#333', // Change the background color when selected
  },
  circle: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: 'white', // Change text color when selected
  },
  dayText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },

  showtimesListContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    width: 'auto',
    backgroundColor: 'black',
  },
  showtimeItem: {
    // Set the direction to row for horizontal layout
    justifyContent: 'center', // Distribute items horizontally
    alignItems: 'center', // Center items vertically
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    margin: 5,
  },
  showtimeText: {
    color: 'black',
    fontSize: 16,
  },

  selectedShowtimeItem: {
    backgroundColor: '#333',
  },
  selectedShowtimeText: {
    color: 'white',
  },
  selectSeatButton: {
    backgroundColor: 'yellow',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  selectSeatButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Showtime;
