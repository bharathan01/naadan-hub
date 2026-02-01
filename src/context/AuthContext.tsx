import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, UserProfile } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: 'user' | 'seller' | 'admin' | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<'user' | 'seller' | 'admin' | null>(null);
    const [loading, setLoading] = useState(true);

    // Watch for user changes to fetch profile
    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            try {
                console.log('AuthContext: Fetching profile for:', userId);
                const profileData = await authService.getUserProfile(userId);
                console.log('AuthContext: Profile fetched:', profileData);
                setProfile(profileData);
                setRole(profileData.role || 'user');
            } catch (error) {
                console.error('AuthContext: Error fetching profile:', error);
                setRole('user');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile(user.id);
        } else {
            setProfile(null);
            setRole(null);
            if (!loading) setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Initial session check
        const initializeAuth = async () => {
            console.log('AuthContext: Initializing auth state...');
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (!session?.user) setLoading(false);
        };

        initializeAuth();

        // Subscibe to auth changes - NON-BLOCKING
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('AuthContext: onAuthStateChange event:', event);
            setUser(session?.user ?? null);
            if (!session?.user) setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
