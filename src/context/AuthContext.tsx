'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cleanUrlHash = (currentSession: Session | null) => {
    if (currentSession?.user) {
      setUser(currentSession.user);
      setSession(currentSession);
    } else {
      setUser(null);
      setSession(null);
    }

    if (
      typeof window !== 'undefined' &&
      (window.location.hash.includes('access_token') || window.location.search.includes('code='))
    ) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      cleanUrlHash(session);
    });

    // 2. Listen for Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      cleanUrlHash(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google Sign In...');

      const redirectUrl =
        typeof window !== 'undefined'
          ? window.location.origin + window.location.pathname
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Google Sign-In Error:', error.message);
        alert(`Google Sign-In Error: ${error.message}\n\nPlease check that the Google Provider is enabled in Supabase Dashboard under Authentication > Providers > Google.`);
        return;
      }

      // Explicitly navigate to the OAuth authorization URL
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Google Sign-In Exception:', err);
      alert(`Google Sign-In failed: ${err?.message || 'Unknown error'}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
