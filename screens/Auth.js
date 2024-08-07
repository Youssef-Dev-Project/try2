import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthentication } from '../hooks/useAuthentication';

export default function Auth() {
  const { login, message } = useAuthentication();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);
  const [localMessage, setLocalMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Reset error states
    setEmptyFields([]);
    setLocalMessage('');

    // Check if fields are empty
    const emptyFields = [];
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');

    if (emptyFields.length > 0) {
      setEmptyFields(emptyFields);
      setLocalMessage('All fields are required');
      return;
    }

    login(email, password, navigation);
  };

  return (
    <View style={styles.container}>
      {/* Big Title */}
      <Text style={styles.appTitle}>LOC-AGRI</Text>

      {/* Top Bubble */}
      <View style={[styles.bubble, styles.topBubble]}></View>
      
      {/* Bottom Bubble */}
      <View style={[styles.bubble, styles.bottomBubble]}></View>
      
      {/* Right Bubble */}
      <View style={[styles.bubble, styles.rightBubble]}></View>
      
      {/* Left Bubble */}
      <View style={[styles.bubble, styles.leftBubble]}></View>

      {/* Additional Bubbles */}
      <View style={[styles.bubble, styles.extraBubble1]}></View>
      <View style={[styles.bubble, styles.extraBubble2]}></View>
      <View style={[styles.bubble, styles.extraBubble3]}></View>
      <View style={[styles.bubble, styles.extraBubble4]}></View>
      <View style={[styles.bubble, styles.extraBubble5]}></View>

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('email') && styles.inputError,
        ]}
        placeholder="Email"
        placeholderTextColor="#a5d6a7" // Light green placeholder text
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (text) {
            setEmptyFields((fields) => fields.filter((field) => field !== 'email'));
          }
        }}
      />
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('password') && styles.inputError,
        ]}
        placeholder="Password"
        placeholderTextColor="#a5d6a7" // Light green placeholder text
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (text) {
            setEmptyFields((fields) => fields.filter((field) => field !== 'password'));
          }
        }}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      {localMessage ? <Text style={styles.errorMessage}>{localMessage}</Text> : null}
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      <Text style={styles.message}>Don't have an account?</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e8f5e9', // Light green background
    position: 'relative', // Make positioning relative for bubble positioning
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green text color
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#388e3c', // Dark green bubble
    borderRadius: 50, // Circle shape
  },
  topBubble: {
    top: -60,
    left: 10,
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  bottomBubble: {
    bottom: -60,
    right: 10,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  rightBubble: {
    top: '50%',
    right: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  leftBubble: {
    top: '50%',
    left: -70,
    width: 90,
    height: 90,
    opacity: 0.3,
  },
  extraBubble1: {
    top: '10%',
    left: '15%',
    width: 60,
    height: 60,
    opacity: 0.4,
  },
  extraBubble2: {
    top: '25%',
    right: '10%',
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  extraBubble3: {
    bottom: '20%',
    left: '30%',
    width: 100,
    height: 100,
    opacity: 0.5,
  },
  extraBubble4: {
    bottom: '40%',
    right: '25%',
    width: 70,
    height: 70,
    opacity: 0.4,
  },
  extraBubble5: {
    top: '70%',
    left: '40%',
    width: 90,
    height: 90,
    opacity: 0.3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green text color
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#388e3c', // Dark green border
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff', // White background for inputs
  },
  inputError: {
    borderColor: '#d32f2f', // Red border color for error
  },
  button: {
    backgroundColor: '#388e3c', // Dark green background
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 3, // Adds shadow on Android
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: 16,
    textAlign: 'center',
    color: '#d32f2f', // Red for error messages
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: '#388e3c', // Dark green text color
  },
});
