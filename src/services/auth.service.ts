import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'seller' | 'admin';
  phone?: string;
  store_name?: string;
  is_verified_seller?: boolean;
}

export const authService = {
  async signUp(email: string, password: string, metadata: Omit<UserProfile, 'id' | 'email'>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data, error)
    if (error) {
      throw error;
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getUserProfile(userId: string) {
    console.log("haiii")
    const { data: { session } } = await supabase.auth.getSession();
    console.log('SESSION:', session);

    if (!session) {
      console.warn('No session, cannot fetch profile');
      return null;
    }

    console.log('AuthService: getUserProfile called with', userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', userId)
      .maybeSingle();

    console.log('AuthService: Profile response:', { data, error });

    if (error) {
      console.error('AuthService: Profile fetch error:', error);
      return null;
    }

    return data as UserProfile | null;
  }
  ,

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  }
};
