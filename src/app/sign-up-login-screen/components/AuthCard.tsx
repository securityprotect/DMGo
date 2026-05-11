'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type AuthMode = 'login' | 'register';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

function LoginForm({ onSuccess, onForgotPassword }: { onSuccess: () => void; onForgotPassword: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const payload = await res.json();
      setError('root', { message: payload.error || 'Invalid credentials' });
      return;
    }
    toast.success('Welcome back! Redirecting to dashboard...');
    onSuccess();
  };

  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
    {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
    <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
    <Input label="Password" type="password" placeholder="********" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
    <button type="button" onClick={onForgotPassword} className="text-sm font-semibold text-primary text-left hover:underline">Forgot password?</button>
    <Button type="submit" loading={isSubmitting} fullWidth size="lg">Sign in to DmGo</Button>
  </form>;
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    if (!res.ok) {
      const payload = await res.json();
      setError('root', { message: payload.error || 'Unable to register' });
      return;
    }
    toast.success('Account created! Welcome to DmGo');
    onSuccess();
  };

  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
    {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
    <Input label="Full name" type="text" placeholder="Maya Chen" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
    <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
    <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
    <Input label="Confirm password" type="password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Please confirm your password', validate: (val) => val === watch('password') || 'Passwords do not match' })} />
    <Button type="submit" loading={isSubmitting} fullWidth size="lg">Create Free Account</Button>
  </form>;
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    if (!res.ok) {
      const detail = payload?.details ? ` (${payload.details})` : '';
      setError('root', { message: `${payload.error || 'Could not send reset link'}${detail}` });
      return;
    }
    toast.success('If your email exists, reset instructions were sent.');
    onBack();
  };

  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
    {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
    <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
    <Button type="submit" loading={isSubmitting} fullWidth size="lg">Send reset link</Button>
    <button type="button" onClick={onBack} className="text-sm font-semibold text-primary hover:underline">Back to sign in</button>
  </form>;
}

function ResetPasswordForm({ token, onBackToLogin }: { token: string; onBackToLogin: () => void }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: data.password }),
    });
    const payload = await res.json();
    if (!res.ok) {
      setError('root', { message: payload.error || 'Could not reset password' });
      return;
    }
    toast.success('Password updated. Please sign in.');
    onBackToLogin();
  };

  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
    {errors.root && <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger font-medium">{errors.root.message}</div>}
    <Input label="New password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
    <Input label="Confirm password" type="password" placeholder="Repeat new password" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Please confirm your password', validate: (val) => val === watch('password') || 'Passwords do not match' })} />
    <Button type="submit" loading={isSubmitting} fullWidth size="lg">Reset password</Button>
  </form>;
}

export default function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showForgot, setShowForgot] = useState(false);
  const handleSuccess = () => setTimeout(() => router.push('/dashboard'), 500);
  const resetToken = searchParams.get('token') || '';
  const isResetMode = searchParams.get('mode') === 'reset' && !!resetToken;

  return <div className="w-full max-w-md animate-slide-up"><div className="card p-8 shadow-card-xl border border-border/60">
    <div className="mb-7"><h1 className="text-2xl font-extrabold text-foreground mb-1">{isResetMode ? 'Reset your password' : mode === 'login' ? 'Welcome back' : 'Create your account'}</h1></div>
    {!isResetMode && !showForgot && <div className="flex bg-muted rounded-xl p-1 mb-6">
      <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode === 'login' ? 'bg-white text-foreground' : 'text-muted-foreground'}`}>Sign in</button>
      <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode === 'register' ? 'bg-white text-foreground' : 'text-muted-foreground'}`}>Create account</button>
    </div>}
    {isResetMode ? <ResetPasswordForm token={resetToken} onBackToLogin={() => router.push('/sign-up-login-screen')} /> : showForgot ? <ForgotPasswordForm onBack={() => setShowForgot(false)} /> : mode === 'login' ? <LoginForm onSuccess={handleSuccess} onForgotPassword={() => setShowForgot(true)} /> : <RegisterForm onSuccess={handleSuccess} />}
  </div></div>;
}
