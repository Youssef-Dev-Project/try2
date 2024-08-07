import { useState } from 'react';
import supabase from '../supabaseClient';

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');

  const login = async (email, password, navigation) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Successfully logged in!');
        setIsAuthenticated(true);
        navigation.navigate('Home');
        console.log('Successfully logged in!');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
    }
  };

  const logout = async (navigation) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout failed:', error);
      } else {
        setIsAuthenticated(false);
        navigation.navigate('Auth');
        console.log('Successfully logged out!');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return { isAuthenticated, login, logout, message };
};
