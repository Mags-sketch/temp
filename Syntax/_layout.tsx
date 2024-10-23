import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

import head from '../assets/images/Capture.png';

// Define Drawer Navigator
const Drawer = createDrawerNavigator();

const InstructorDashboard = () => (
  <View style={styles.container}>
    <Text style={styles.welcomeText}>Welcome to the Instructor Dashboard!</Text>
  </View>
);

const StudentDashboard = () => (
  <View style={styles.container}>
    <Text style={styles.welcomeText}>Welcome to the Student Dashboard!</Text>
  </View>
);

const ProfileScreen = ({ navigation, name, onProfileUpdate }) => {
  const [editName, setEditName] = useState(name);

  const handleSave = () => {
    onProfileUpdate(editName);
    Alert.alert("Profile Updated", "Your profile has been updated successfully.", [
      {
        text: "OK",
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeader}>Profile</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={editName}
          onChangeText={setEditName}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingsScreen = ({ onLogout }) => (
  <View style={styles.container}>
    <Text style={styles.profileHeader}>Settings</Text>
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>Log Out</Text>
    </TouchableOpacity>
  </View>
);

const ForgotPasswordScreen = ({ onRequestReset, onBackToLogin }) => {
  const [email, setEmail] = useState('');

  const handleRequestReset = () => {
    if (email) {
      Alert.alert("Password Reset Request", `Reset link sent to ${email}.`);
      setEmail('');
      onBackToLogin();
    } else {
      Alert.alert("Error!!", "Please enter your email.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={head} />
      <Text style={styles.headerText}>Appointment Management System</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleRequestReset}>
        <Text style={styles.submitButtonText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBackToLogin}>
        <Text style={styles.switchMode}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const Apps = () => {
  const [name, setName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:8081/server.php')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setName('');
    setStudentNo('');
    setEmail('');
    setPassword('');
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  const handleProfileUpdate = (updatedName) => {
    setName(updatedName);
  };

  const handleSubmit = () => {
    if (isRegistering) {
      Alert.alert("Registration", `Successfully registered as ${isInstructor ? 'Instructor' : 'Student'} with email: ${email}.`);
      setIsRegistering(false);
    } else {
      if (password) {
        Alert.alert("Log in", `Welcome back, ${name}!`);
        setIsLoggedIn(true);
      } else {
        Alert.alert("Error", "Invalid Email or password.");
      }
    }
  };

  if (isForgotPassword) {
    return (
      <ForgotPasswordScreen
        onRequestReset={() => setIsForgotPassword(false)}
        onBackToLogin={() => setIsForgotPassword(false)}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={head} />
          <Text style={styles.headerText}>Appointment Management System</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {isRegistering && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
            </View>
            {isInstructor ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Employee ID"
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Department"
                    value={department}
                    onChangeText={setDepartment}
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Student No."
                  value={studentNo}
                  onChangeText={setStudentNo}
                />
              </View>
            )}
          </>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isRegistering ? 'Register' : 'Log in'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchMode}>
            {isRegistering ? 'Already have an account? Log in' : 'Register '}
          </Text>
        </TouchableOpacity>
        {isRegistering && (
          <TouchableOpacity onPress={() => setIsInstructor(!isInstructor)}>
            <Text style={styles.switchMode}>
              {isInstructor ? 'Switch to Student Registration' : 'Register as Instructor'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        {isInstructor ? (
          <Drawer.Screen name="Home" component={InstructorDashboard} />
        ) : (
          <Drawer.Screen name="Home" component={StudentDashboard} />
        )}
        <Drawer.Screen name="Profile">
          {({ navigation }) => (
            <ProfileScreen
              navigation={navigation}
              name={name}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Settings">
          {() => <SettingsScreen onLogout={handleLogout} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileHeader: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    margin: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#276630',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchMode: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Apps;
