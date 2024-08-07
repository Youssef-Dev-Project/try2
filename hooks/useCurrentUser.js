// hooks/useCurrentUser.js
import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const user = supabase.auth.user();
      setUser(user);
      setLoading(false);
    };

    getUserInfo();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return { user, loading };
};

export default useCurrentUser;
