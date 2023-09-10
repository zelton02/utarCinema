import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const AccountDetails = ({route}) => {
  const {userEmail} = route.params;
  const [userData, setUserData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const db = SQLite.openDatabase(
    {name: 'db.sqlite', location: 'Library'},
    () => {
      const loadUser = () => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM users WHERE email = ?',
            [userEmail],
            (tx, results) => {
              const len = results.rows.length;
              if (len > 0) {
                const user = results.rows.item(0);
                setUserData(user);
              }
            },
          );
        });
      };

      loadUser();
    },
    error => {
      console.error('Error opening database:', error);
    },
  );

  const handleResetPassword = () => {
    if (!newPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET password = ? WHERE email = ?',
        [newPassword, userEmail],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setSuccessMessage('Password updated successfully.');
            setNewPassword('');
            setShowPasswordModal(false);
          } else {
            setErrorMessage('Password update failed.');
          }
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Details</Text>
      {userData && (
        <View style={styles.userItem}>
          <Text>User ID: {userData.id}</Text>
          <Text>Username: {userData.username}</Text>
          <Text>Email: {userData.email}</Text>
          <Button
            title="Reset Password"
            onPress={() => setShowPasswordModal(true)}
          />
        </View>
      )}

      <Modal visible={showPasswordModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Reset Password</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="New Password"
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            secureTextEntry
          />
          <Button title="Update Password" onPress={handleResetPassword} />
          <Button title="Close" onPress={() => setShowPasswordModal(false)} />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ccc',
  },
  userItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 16,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: '80%',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
});

export default AccountDetails;
