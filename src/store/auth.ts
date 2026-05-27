import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

const buildUserFromSession = (session: Session | null): User | null => {
  if (!session?.user) return null;

  const metadata = (session.user.user_metadata ?? {}) as {
    full_name?: string;
    role?: string;
    avatar_url?: string | null;
  };

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    full_name: metadata.full_name ?? '',
    role: metadata.role === 'admin' ? 'admin' : 'user',
    avatar_url: metadata.avatar_url ?? null,
    created_at: session.user.created_at,
  };
};

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      const user = profile
        ? {
            id: session.user.id,
            email: session.user.email ?? '',
            full_name: profile.full_name ?? '',
            role: profile.role ?? 'user',
            avatar_url: profile.avatar_url,
            created_at: session.user.created_at,
          }
        : buildUserFromSession(session);

      set({
        session,
        user,
        isAdmin: user?.role === 'admin',
        loading: false,
      });
    } else {
      set({ session: null, user: null, isAdmin: false, loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        (async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const user = profile
            ? {
                id: session.user.id,
                email: session.user.email ?? '',
                full_name: profile.full_name ?? '',
                role: profile.role ?? 'user',
                avatar_url: profile.avatar_url,
                created_at: session.user.created_at,
              }
            : buildUserFromSession(session);

          set({
            session,
            user,
            isAdmin: user?.role === 'admin',
            loading: false,
          });
        })();
      } else {
        set({ session: null, user: null, isAdmin: false, loading: false });
      }
    });
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },
}));
