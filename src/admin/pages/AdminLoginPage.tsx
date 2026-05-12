import { Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAdminAuth } from '../auth/AdminAuthProvider';

type LoginLocationState = {
  from?: string;
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const redirectTo = useMemo(() => {
    const state = location.state as LoginLocationState | null;
    return state?.from ?? '/admin';
  }, [location.state]);

  useEffect(() => {
    if (!loading && session) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, navigate, redirectTo, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const { error: signInError, session: signInSession } = await signIn(email, password);

    if (signInError) {
      setSubmitting(false);
      return;
    }

    if (!signInSession) {
      toast({
        title: 'Sign in incomplete',
        description: 'Sign in succeeded but no session was returned.',
        variant: 'error',
      });
      setSubmitting(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-start gap-3">
              <img src="/Mwezi_Cup_logo.svg" alt="Mwezi Cup" className="h-10 w-auto object-contain" />
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin sign in</h1>
            </div>

            <Card className="border-border shadow-lg">
              <CardContent className="space-y-5 pt-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@mwezicup.com"
                      autoComplete="email"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="h-11 pl-9 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={submitting}>
                    {submitting ? (
                      <>
                        <LogIn className="h-4 w-4 animate-pulse" />
                        Signing in
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Sign in
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="relative hidden overflow-hidden border-l border-border lg:block">
          <img
            src="/img/login bg.jpg"
            alt="Mwezi Cup login background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background/10 to-background/20" />
        </div>
      </div>
    </div>
  );
}
