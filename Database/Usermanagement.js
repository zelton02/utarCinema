// This is a backend Test for developers uses aka User Managment system
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const TestScreen = () => {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);

  const db = SQLite.openDatabase(
    {name: 'db.sqlite', location: 'Library'},
    () => {
      const loadUsers = () => {
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM users', [], (tx, results) => {
            const len = results.rows.length;
            if (len > 0) {
              const userArray = [];
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                userArray.push(row);
              }
              setUsers(userArray);
            }
          });
        });
      };

      loadUsers();
    },
    error => {
      console.error('Error opening database:', error);
    },
  );

  const handleCreateUser = () => {
    if (newUser.username && newUser.email && newUser.password) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [newUser.username, newUser.email, newUser.password],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('User created successfully.');
              loadUsers();
            } else {
              console.log('User creation failed.');
            }
          },
        );
      });
    }
  };

  const printAllUsers = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        const len = results.rows.length;
        if (len > 0) {
          console.log('All Users:');
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            console.log(
              `User ID: ${row.id}, Username: ${row.username}, Email: ${row.email}`,
            );
          }
        } else {
          console.log('No users found in the database.');
        }
      });
    });
  };

  const openModal = id => {
    setUserIdToUpdate(id);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleUpdatePassword = () => {
    if (newPassword) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET password = ? WHERE id = ?',
          [newPassword, userIdToUpdate],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Password updated successfully.');
              closeModal();
              loadUsers();
            } else {
              console.log('Password update failed.');
            }
          },
        );
      });
    } else {
      console.log('New password field is empty.');
    }
  };
  const handleDeleteUser = id => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM users WHERE id = ?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('User deleted successfully.');
          loadUsers(); // Reload the user list
        } else {
          console.log('User deletion failed.');
        }
      });
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Management</Text>

      <Text style={styles.subheading}>Create User:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={newUser.username}
        onChangeText={text => setNewUser({...newUser, username: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newUser.email}
        onChangeText={text => setNewUser({...newUser, email: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={newUser.password}
        onChangeText={text => setNewUser({...newUser, password: text})}
        secureTextEntry={true}
      />
      <Button title="Create User" onPress={handleCreateUser} />

      <Text style={styles.subheading}>
        User List:
        <Button title="Print Users [Check Console]" onPress={printAllUsers} />
      </Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.userItem}>
            <Text>User ID: {item.id}</Text>
            <Text>Username: {item.username}</Text>
            <Text>Email: {item.email}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Update Password"
                onPress={() => openModal(item.id)}
              />
              <Button
                title="Delete User"
                onPress={() => handleDeleteUser(item.id)}
              />
            </View>
          </View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Update Password</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="New Password"
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            secureTextEntry={true}
          />
          <Button title="Update Password" onPress={handleUpdatePassword} />
          <Button title="Close" onPress={closeModal} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  userItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 24,
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
});

export default TestScreen;
