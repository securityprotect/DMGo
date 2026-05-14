'use client';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type AuthMode = 'login' | 'register';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp?: string;
}

interface ForgotPasswordFormData {
  email: string;
  otp?: string;
  password: string;
  confirmPassword: string;
}

function LoginForm({ nextPath, forgotHref, initialError }: { nextPath: string; forgotHref: string; initialError: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, next: nextPath }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError('root', { message: payload.error || 'Invalid credentials' });
      return;
    }
    toast.success('Welcome back! Redirecting to dashboard...');
    setTimeout(() => router.push(nextPath), 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} action="/api/auth/login" method="post" className="flex flex-col gap-4" noValidate>
      {initialError === 'invalid_credentials' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Invalid email or password.
        </div>
      )}
      {initialError === 'missing_credentials' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Please enter both email and password.
        </div>
      )}
      {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
      <input type="hidden" name="next" value={nextPath} />
      <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
      <Input label="Password" type="password" placeholder="********" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
      <a href={forgotHref} className="text-sm font-semibold text-primary text-left hover:underline">Forgot password?</a>
      <Button type="submit" loading={isSubmitting} fullWidth size="lg">Sign in to DmGo</Button>
    </form>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [pendingEmail, setPendingEmail] = useState('');
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<RegisterFormData>();

  const onRequestOtp = async () => {
    const data = getValues();
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    const res = await fetch('/api/auth/register/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError('root', { message: payload.error || 'Unable to send OTP' });
      return;
    }
    setPendingEmail(data.email);
    toast.success('OTP sent to your email');
  };

  const onVerifyOtp = async () => {
    const data = getValues();
    const otp = String((data as any).otp || '').trim();
    if (!otp || otp.length < 5) {
      setError('root', { message: 'Enter a valid OTP code' });
      return;
    }
    const res = await fetch('/api/auth/register/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: pendingEmail || data.email, otp }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError('root', { message: payload.error || 'OTP verification failed' });
      return;
    }
    toast.success('Account created successfully');
    setTimeout(() => router.push('/dashboard'), 500);
  };

  return (
    <form className="flex flex-col gap-4" noValidate>
      {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
      <Input label="Full name" type="text" placeholder="Maya Chen" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
      <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
      <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
      <Input label="Confirm password" type="password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Please confirm your password', validate: (val) => val === watch('password') || 'Passwords do not match' })} />
      <Input label="Verification OTP" type="text" placeholder="Enter 5-6 digit OTP" {...register('otp', { minLength: { value: 5, message: 'OTP must be 5-6 digits' } })} />
      <Button type="button" onClick={() => void onRequestOtp()} loading={isSubmitting} fullWidth size="lg">Send OTP</Button>
      <Button type="button" onClick={() => void onVerifyOtp()} fullWidth size="lg">Verify OTP & Create Account</Button>
    </form>
  );
}

function ForgotPasswordForm({
  backHref,
  initialEmail,
  initialOtpSent,
  initialError,
  initialStageVerified,
}: {
  backHref: string;
  initialEmail: string;
  initialOtpSent: boolean;
  initialError: string;
  initialStageVerified: boolean;
}) {
  const [otpSent, setOtpSent] = useState(initialOtpSent);
  const [otpVerified, setOtpVerified] = useState(initialStageVerified);
  const [resendSeconds, setResendSeconds] = useState(initialOtpSent ? 30 : 0);
  const [lockedEmail, setLockedEmail] = useState(initialEmail || '');
  const [isResetting, setIsResetting] = useState(false);
  const {
    register,
    setValue,
    watch,
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: initialEmail || '',
    },
  });
  const resetPassword = useWatch({ control, name: 'password' }) || '';
  const resetConfirmPassword = useWatch({ control, name: 'confirmPassword' }) || '';
  const resetPasswordsMatch = resetPassword.length >= 8 && resetPassword === resetConfirmPassword;

  useEffect(() => {
    void trigger(['password', 'confirmPassword']);
  }, [resetPassword, resetConfirmPassword, trigger]);

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
      setLockedEmail(initialEmail);
    }
  }, [initialEmail, setValue]);

  useEffect(() => {
    if (!otpSent || resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, resendSeconds]);

  const onResetWithOtp = async (data: ForgotPasswordFormData) => {
    const emailToUse = (lockedEmail || data.email || '').trim().toLowerCase();
    if (!otpVerified) {
      setError('root', { message: 'Please verify OTP first' });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      setIsResetting(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, newPassword: data.password }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError('root', { message: payload.error || 'Could not reset password' });
        return;
      }
      toast.success('Password updated. Please sign in.');
      window.location.href = backHref;
    } catch {
      setError('root', { message: 'Network error. Please try again.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <form
      action={otpVerified ? '/api/auth/reset-password' : '/api/auth/forgot-password'}
      method="post"
      onSubmit={otpVerified ? handleSubmit(onResetWithOtp) : undefined}
      className="flex flex-col gap-4"
      noValidate
    >
      {initialError && !errors.root && initialError !== 'invalid_otp' && initialError !== 'otp_expired' && initialError !== 'no_otp_request' && initialError !== 'missing_otp' && initialError !== 'verify_otp_first' && initialError !== 'weak_password' && initialError !== 'missing_reset_fields' && initialError !== 'user_not_found' && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Could not send OTP. Please check sender/domain setup in Resend and try again.
        </div>
      )}
      {initialError === 'missing_otp' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          OTP verification needs both email and OTP. Please enter OTP and try again.
        </div>
      )}
      {initialError === 'invalid_otp' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Invalid OTP. Please check the code and try again.
        </div>
      )}
      {initialError === 'otp_expired' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          OTP expired. Please request a new code.
        </div>
      )}
      {initialError === 'no_otp_request' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          No OTP request found. Please click Send OTP first.
        </div>
      )}
      {initialError === 'verify_otp_first' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Please verify OTP first.
        </div>
      )}
      {initialError === 'weak_password' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Password must be at least 8 characters.
        </div>
      )}
      {initialError === 'missing_reset_fields' && !errors.root && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">
          Please enter both password fields.
        </div>
      )}
      {initialOtpSent && !initialError && !errors.root && (
        <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
          OTP sent successfully. Enter the code received on your email.
        </div>
      )}
      {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
      {!otpSent ? (
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
      ) : (
        <>
          <Input
            label="Email address"
            type="email"
            readOnly
            value={lockedEmail}
            className="opacity-70 cursor-not-allowed"
          />
          <input type="hidden" name="email" value={lockedEmail} />
        </>
      )}
      {!otpVerified && (
        <>
          <Input
            label="OTP code"
            type="text"
            placeholder={otpSent ? 'Enter 5-6 digit OTP' : 'Send OTP first'}
            error={errors.otp?.message}
            disabled={!otpSent}
            className={!otpSent ? 'opacity-60 cursor-not-allowed' : ''}
            {...register('otp', { required: 'OTP is required', minLength: { value: 5, message: 'OTP must be 5-6 digits' } })}
          />
          {!otpSent ? (
            <Button type="submit" loading={isSubmitting} fullWidth size="lg">Send OTP</Button>
          ) : (
            <>
              <Button
                type="submit"
                fullWidth
                size="lg"
                formAction="/api/auth/forgot-password/verify-otp"
                formMethod="post"
              >
                Verify OTP
              </Button>
              {resendSeconds === 0 ? (
                <Button type="submit" loading={isSubmitting} fullWidth size="lg" variant="secondary">
                  Resend OTP
                </Button>
              ) : (
                <Button type="button" disabled fullWidth size="lg" variant="secondary">
                  Resend OTP in {resendSeconds}s
                </Button>
              )}
            </>
          )}
        </>
      )}
      {otpVerified && (
        <>
          <input type="hidden" name="email" value={lockedEmail} />
          <Input label="New password" type="password" autoComplete="new-password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
          <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat new password" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Please confirm your password', validate: (val) => val === watch('password') || 'Passwords do not match' })} />
          <input type="hidden" name="newPassword" value={resetPassword || ''} />
          {!resetPasswordsMatch && resetConfirmPassword && (
            <p className="text-xs text-danger font-medium">Password not matched</p>
          )}
          <Button type="submit" loading={isResetting} disabled={isResetting} fullWidth size="lg">Reset Password</Button>
        </>
      )}
      <a href={backHref} className="text-sm font-semibold text-primary hover:underline">Back to sign in</a>
    </form>
  );
}

export default function AuthCard() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const mode: AuthMode = view === 'register' ? 'register' : 'login';
  const showForgot = view === 'forgot';
  const resetDone = searchParams.get('reset') === '1';
  const forgotSent = searchParams.get('sent') === '1';
  const forgotEmail = searchParams.get('email') || '';
  const forgotError = searchParams.get('error') || '';
  const loginError = !showForgot ? searchParams.get('error') || '' : '';
  const forgotStageVerified = searchParams.get('stage') === 'verified';
  const nextPath = searchParams.get('next') || '/dashboard';
  const makeAuthUrl = (nextView: 'login' | 'register' | 'forgot') =>
    `/sign-up-login-screen?view=${nextView}&next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="w-full max-w-md animate-slide-up relative z-50 pointer-events-auto">
      <div className="card p-8 shadow-card-xl border border-border/60 relative z-50 pointer-events-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-foreground mb-1">
            {showForgot ? 'Reset your password' : mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>
        {!showForgot && mode === 'login' && resetDone && (
          <div className="mb-4 bg-success/10 border border-success/20 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
            Password reset successful. Please sign in with your new password.
          </div>
        )}
        {!showForgot && (
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <a href={makeAuthUrl('login')} className={`flex-1 py-2 rounded-lg text-sm font-semibold text-center ${mode === 'login' ? 'bg-white text-foreground' : 'text-muted-foreground'}`}>Sign in</a>
            <a href={makeAuthUrl('register')} className={`flex-1 py-2 rounded-lg text-sm font-semibold text-center ${mode === 'register' ? 'bg-white text-foreground' : 'text-muted-foreground'}`}>Create account</a>
          </div>
        )}
        {showForgot ? (
          <ForgotPasswordForm
            backHref={makeAuthUrl('login')}
            initialEmail={forgotEmail}
            initialOtpSent={forgotSent}
            initialError={forgotError}
            initialStageVerified={forgotStageVerified}
          />
        ) : mode === 'login' ? (
          <LoginForm nextPath={nextPath} forgotHref={makeAuthUrl('forgot')} initialError={loginError} />
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
}
