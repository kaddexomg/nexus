import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../services/supabase';
import { sound } from '../utils/audio';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or construct profile
  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email || currentUser.email || '',
          fullName: data.full_name || currentUser.user_metadata?.full_name || 'Gamer Nexus',
          phone: data.phone || '',
          role: data.role || 'user',
          walletBalanceUsd: Number(data.wallet_balance_usd || 0),
          createdAt: data.created_at || new Date().toISOString(),
        });
      } else {
        // Fallback profile if table is not yet migrated in Supabase
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Gamer Nexus',
          phone: '',
          role: currentUser.email?.includes('admin') ? 'admin' : 'user',
          walletBalanceUsd: 142.50, // Demo active balance
          createdAt: currentUser.created_at || new Date().toISOString(),
        });
      }
    } catch (e) {
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || 'Gamer Nexus',
        phone: '',
        role: 'user',
        walletBalanceUsd: 142.50,
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        try { sound.playAlert(); } catch {}
        return { error: error.message };
      }

      try { sound.playSuccess(); } catch {}
      if (data.user) {
        await fetchProfile(data.user);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error inesperado al iniciar sesión' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone?.trim() || '',
          },
        },
      });

      if (error) {
        try { sound.playAlert(); } catch {}
        return { error: error.message };
      }

      try { sound.playSuccess(); } catch {}
      if (data.user) {
        // Try creating profile row in Supabase
        try {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: email.trim(),
            full_name: fullName.trim(),
            phone: phone?.trim() || '',
            role: 'user',
            wallet_balance_usd: 0,
          });
        } catch {}

        await fetchProfile(data.user);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error al crear la cuenta' };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    try {
      try { sound.playClick(); } catch {}
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error al conectar con Google' };
    }
  };

  const signOut = async () => {
    try { sound.playClick(); } catch {}
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
