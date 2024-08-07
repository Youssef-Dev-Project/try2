import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import supabase from '../supabaseClient';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);

  const handleRegister = async () => {
    // Reset error states
    setEmptyFields([]);
    setMessage('');

    // Check if all fields are filled
    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');
    if (!confirmPassword) emptyFields.push('confirmPassword');

    if (emptyFields.length > 0) {
      setMessage('All fields are required');
      setEmptyFields(emptyFields);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setEmptyFields(['password', 'confirmPassword']);
      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        }
      );

      if (error) {
        console.error('Error registering:', error);
        setMessage('Error registering: ' + error.message);
      } else {
        setMessage('Successfully registered! Please log in.');
        navigation.navigate('Auth');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('Unexpected error: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>LOC-AGRI</Text>

      {/* Bubbles */}
      <View style={[styles.bubble, styles.topBubble]}></View>
      <View style={[styles.bubble, styles.bottomBubble]}></View>
      <View style={[styles.bubble, styles.rightBubble]}></View>
      <View style={[styles.bubble, styles.leftBubble]}></View>
      <View style={[styles.bubble, styles.extraBubble1]}></View>
      <View style={[styles.bubble, styles.extraBubble2]}></View>
      <View style={[styles.bubble, styles.extraBubble3]}></View>
      <View style={[styles.bubble, styles.extraBubble4]}></View>
      <View style={[styles.bubble, styles.extraBubble5]}></View>

      <Text style={styles.title}>Register</Text>
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('firstName') && styles.inputError,
        ]}
        placeholder="First Name"
        placeholderTextColor="#a5d6a7" 
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('lastName') && styles.inputError,
        ]}
        placeholder="Last Name"
        placeholderTextColor="#a5d6a7" 
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('email') && styles.inputError,
        ]}
        placeholder="Email"
        placeholderTextColor="#a5d6a7" 
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('password') && styles.inputError,
        ]}
        placeholder="Password"
        placeholderTextColor="#a5d6a7" 
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={[
          styles.input,
          emptyFields.includes('confirmPassword') && styles.inputError,
        ]}
        placeholder="Confirm Password"
        placeholderTextColor="#a5d6a7" 
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      <Text style={styles.message}>Already have an account?</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e8f5e9', 
    position: 'relative', 
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#388e3c', 
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#388e3c', 
    borderRadius: 50, 
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
    color: '#388e3c', 
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#388e3c', 
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff', 
  },
  inputError: {
    borderColor: '#d32f2f', 
  },
  button: {
    backgroundColor: '#388e3c', 
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 3, 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: '#388e3c', 
  },
  errorMessage: {
    marginTop: 16,
    textAlign: 'center',
    color: '#d32f2f', 
  },
});
