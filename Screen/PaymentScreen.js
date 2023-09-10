import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({route, navigation}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); // Initialize total amount
  const [isCardValid, setIsCardValid] = useState(true); // Card validation state

  const {params} = route;

  useEffect(() => {
    console.log('Received Movie Name:', params?.movieName);
    console.log('Received Date:', params?.selectedDate);
    console.log('Received Showtime:', params?.selectedShowtime);
    console.log('Seat Booked:', params?.bookedSeats?.join(', '));

    // Calculate total amount based on the number of selected seats
    const seatPrice = 15; // Price per seat
    const numberOfSeats = params?.bookedSeats?.length || 0;
    const calculatedTotalAmount = seatPrice * numberOfSeats;
    setTotalAmount(calculatedTotalAmount);
  }, [params]);

  const handleCardNumberChange = text => {
    // Remove any non-numeric characters from the input
    const cleanedInput = text.replace(/[^0-9]/g, '');

    // Limit card number to 16 digits
    const truncatedInput = cleanedInput.slice(0, 16);

    // Update card number state
    setCardNumber(truncatedInput);

    // Check if the card number is less than 16 digits
    if (truncatedInput.length < 16) {
      setIsCardValid(false);
    } else {
      setIsCardValid(true);
    }

    console.log('Card Number:', truncatedInput); // Log the card number
  };

  const handleExpiryDateChange = text => {
    // Remove any non-numeric characters from the input
    const cleanedText = text.replace(/[^0-9]/g, '');

    if (cleanedText.length === 4) {
      // If the input has exactly 4 digits, split it into month and year
      const month = cleanedText.substring(0, 2);
      const year = cleanedText.substring(2, 4);

      // Check if the month is valid (01-12) and the year is valid (23-35)
      if (
        /^(0[1-9]|1[0-2])$/.test(month) &&
        /^(23|24|25|26|27|28|29|30|31|32|33|34|35)$/.test(year)
      ) {
        // Input is valid, format it as MM/YY
        setExpiryDate(`${month}/${year}`);
      } else {
        // Invalid month or year, clear the input
        setExpiryDate('');
        Alert.alert(
          'Invalid Expiry Date',
          'Please enter a valid Expiry Date (MMYY)',
        );
      }
    } else {
      // Input is not yet complete, set it as is
      setExpiryDate(cleanedText);
    }
    console.log('Expiry Date:', cleanedText); // Log the expiry date
  };

  const handlePayment = async () => {
    // Simulated payment logic (replace with actual payment processing)

    // Check if the card number is exactly 16 digits and expiry date is 4 digits
    if (cardNumber.length === 16 && expiryDate.length === 5) {
      console.log('Payment Conditions Met:', cardNumber, expiryDate);

      // Retrieve existing booking history data from AsyncStorage
      try {
        const existingData = await AsyncStorage.getItem('bookingHistory');
        let existingBookings = existingData ? JSON.parse(existingData) : [];

        // Ensure that existingBookings is an array
        if (!Array.isArray(existingBookings)) {
          existingBookings = [];
        }

        // Create a new booking entry
        const newBooking = {
          movieName: params?.movieName,
          selectedDate: params?.selectedDate,
          selectedShowtime: params?.selectedShowtime,
          bookedSeats: params?.bookedSeats,
        };

        // Append the new booking to the existing array
        existingBookings.push(newBooking);

        // Store the updated array back in AsyncStorage
        await AsyncStorage.setItem(
          'bookingHistory',
          JSON.stringify(existingBookings),
        );

        // Payment successful
        Alert.alert(
          'Payment Successful',
          `Thank you for your purchase! Total Amount: $${totalAmount}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to HomeScreen
                navigation.navigate('HomeScreen');
              },
            },
          ],
        );
      } catch (error) {
        console.error('Error updating booking history:', error);
        // Handle error
      }
    } else {
      console.log('Payment Conditions Not Met:', cardNumber, expiryDate);
      // Payment failed
      Alert.alert(
        'Payment Failed',
        'Please fill in all payment details correctly.',
        [{text: 'OK'}],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <TextInput
        style={[styles.input, !isCardValid && styles.invalidInput]} // Apply style if card is invalid
        placeholder="Card Number"
        onChangeText={handleCardNumberChange}
        value={cardNumber}
        keyboardType="numeric"
        maxLength={16}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (MM/YY)"
        onChangeText={handleExpiryDateChange}
        value={expiryDate}
        keyboardType="numeric"
        maxLength={5}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        onChangeText={text => setCvv(text)}
        value={cvv}
        keyboardType="numeric"
        maxLength={3} // Limit CVV input to 3 digits
      />
      <Text style={styles.totalAmount}>Total Amount: ${totalAmount}</Text>
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  invalidInput: {
    borderColor: 'red', // Change border color for invalid input
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PaymentScreen;
