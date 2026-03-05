import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    forgotPassword,
    verifyPin,
    resetPassword,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = email/OTP, 2 = new password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isResetMode) {
        if (step === 1) {
          // Send OTP
          const res = await forgotPassword(email);
          if (!res.success) {
            setError(res.error || 'Failed to send reset code');
          } else {
            setStep(2);
          }
        } else {
          // Verify + reset password
          const resVerify = await verifyPin(email, otp);
          if (!resVerify.success) {
            setError(resVerify.error || 'Invalid or expired code');
            setLoading(false);
            return;
          }
          const resReset = await resetPassword(email, newPassword, otp);
          if (!resReset.success) {
            setError(resReset.error || 'Failed to reset password');
          } else {
            setIsResetMode(false);
            setStep(1);
            setPassword('');
            setNewPassword('');
            setOtp('');
            setError('');
          }
        }
      } else {
        let result;
        if (authModalMode === 'login') {
          result = await login(email, password);
        } else {
          result = await signup(name, email, password);
        }

        if (!result.success) {
          setError(result.error || 'An error occurred');
        } else {
          setEmail('');
          setPassword('');
          setName('');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setAuthModalMode(authModalMode === 'login' ? 'signup' : 'login');
    setError('');
    setIsResetMode(false);
    setStep(1);
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">
            {isResetMode
              ? step === 1
                ? 'Reset Password'
                : 'Set New Password'
              : authModalMode === 'login'
              ? 'Welcome Back'
              : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isResetMode && authModalMode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          {/* Email field (always needed) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password / reset fields */}
          {!isResetMode && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {isResetMode && step === 1 && (
            <p className="text-xs text-muted-foreground">
              Enter your email and click "Send Code" to receive a 6-digit OTP.
            </p>
          )}

          {isResetMode && step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isResetMode
              ? step === 1
                ? 'Send Code'
                : 'Reset Password'
              : authModalMode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-1">
            {!isResetMode && (
              <div>
                {authModalMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            )}

            {!isResetMode && authModalMode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setStep(1);
                  setError('');
                }}
                className="text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            )}

            {isResetMode && (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setStep(1);
                  setError('');
                  setOtp('');
                  setNewPassword('');
                }}
                className="text-primary hover:underline font-medium"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;