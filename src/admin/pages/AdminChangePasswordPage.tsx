import { ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '../auth/AdminAuthProvider';
import { completeAdminInvite } from '../services/adminUsersService';

export default function AdminChangePasswordPage() {
  const navigate = useNavigate();
  const { refreshAdminProfile } = useAdminAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Choose a password with at least 8 characters.',
        variant: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Make sure both password fields match before continuing.',
        variant: 'error',
      });
      return;
    }

    setSubmitting(true);

    const { error } = await completeAdminInvite(newPassword);

    if (error) {
      toast({
        title: 'Password update failed',
        description: error,
        variant: 'error',
      });
      setSubmitting(false);
      return;
    }

    await supabase.auth.refreshSession();
    await refreshAdminProfile();

    toast({
      title: 'Password updated',
      description: 'Your admin account is now active. You can continue into the dashboard.',
      variant: 'success',
    });

    setSubmitting(false);
    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,30,61,0.08),_transparent_32%),linear-gradient(180deg,#fff8fa_0%,#fff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <Card className="w-full border-[#f1c4cf] bg-white/90 shadow-2xl shadow-[#f3c4cf]/20 backdrop-blur">
          <CardHeader className="space-y-5 pb-2 text-center">
            <img src="/Mwezi_Cup_logo.svg" alt="Mwezi Cup" className="mx-auto h-10 w-auto object-contain" />
            <CardTitle className="text-2xl tracking-tight text-[#2e1118]">Set a new password</CardTitle>
            <p className="text-sm leading-6 text-[#7f5661]">
              Create the password for your admin account.
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter a secure password"
                  autoComplete="new-password"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat the new password"
                  autoComplete="new-password"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <Button type="submit" className="h-11 w-full rounded-xl bg-[#c81d3b] text-white hover:bg-[#ab1730]" disabled={submitting}>
                {submitting ? (
                  'Updating password'
                ) : (
                  <>
                    Continue to admin
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
