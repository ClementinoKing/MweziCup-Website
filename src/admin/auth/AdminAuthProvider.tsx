import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import type { AdminProfile } from '../types/admin';
import { loadCurrentAdminProfile } from '../services/adminUsersService';

type AdminAuthContextValue = {
  session: Session | null;
  user: User | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  refreshAdminProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null; session: Session | null }>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const bootstrapTimeoutMs = 1500;

  const refreshAdminProfile = useCallback(
    async (nextSession: Session | null) => {
      if (!nextSession) {
        setAdminProfile(null);
        return;
      }

      const { data, error } = await loadCurrentAdminProfile(nextSession.user.id);

      if (error) {
        toast({
          title: 'Admin profile unavailable',
          description: error,
          variant: 'error',
        });
        setAdminProfile(null);
        return;
      }

      setAdminProfile(data);
    },
    [toast],
  );

  useEffect(() => {
    let mounted = true;
    const bootstrapTimer = window.setTimeout(() => {
      if (!mounted) return;
      setLoading(false);
    }, bootstrapTimeoutMs);

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        window.clearTimeout(bootstrapTimer);
        if (error) {
          toast({
            title: 'Session check failed',
            description: error.message,
            variant: 'error',
          });
          setSession(null);
          setAdminProfile(null);
          setLoading(false);
          return;
        }

        const nextSession = data.session ?? null;
        setSession(nextSession);
        setLoading(false);

        if (!nextSession) {
          setAdminProfile(null);
          return;
        }

        refreshAdminProfile(nextSession)
          .catch(() => {
            if (!mounted) return;
            setAdminProfile(null);
          });
      })
      .catch(() => {
        if (!mounted) return;
        window.clearTimeout(bootstrapTimer);
        setSession(null);
        setAdminProfile(null);
        setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (!nextSession) {
        setAdminProfile(null);
        return;
      }

      refreshAdminProfile(nextSession)
        .catch(() => {
          if (!mounted) return;
          setAdminProfile(null);
        });
    });

    return () => {
      mounted = false;
      window.clearTimeout(bootstrapTimer);
      data.subscription.unsubscribe();
    };
  }, [refreshAdminProfile, toast]);

  const value = useMemo<AdminAuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      adminProfile,
      loading,
      refreshAdminProfile: async () => {
        await refreshAdminProfile(session);
      },
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({
            title: 'Sign in failed',
            description: error.message,
            variant: 'error',
          });
        }
        return { error: error?.message ?? null, session: data.session ?? null };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            title: 'Sign out failed',
            description: error.message,
            variant: 'error',
          });
        }
      },
    };
  }, [adminProfile, loading, refreshAdminProfile, session, toast]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }

  return context;
}
