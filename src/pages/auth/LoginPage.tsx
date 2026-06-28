import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  totp_code: z.string().length(6, 'TOTP code must be 6 digits').optional().or(z.literal('')),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  const successMessage = location.state?.message;
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      
      if (response.data.data.require_2fa && !show2FA) {
        setShow2FA(true);
        setIsLoading(false);
        return;
      }

      const { access_token: accessToken, refresh_token: refreshToken, user } = response.data.data;
                login(accessToken, refreshToken, user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md" title={show2FA ? "Two-Factor Authentication" : "Login to NovaBit"}>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!show2FA ? (
            <>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
              <div className="flex justify-end -mt-2">
                <Link to="/forgot-password" title="Forgot Password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">
                Please enter the 6-digit code from your authenticator app.
              </p>
              <Input
                label="2FA Code"
                type="text"
                placeholder="123456"
                {...register('totp_code')}
                error={errors.totp_code?.message}
                autoFocus
              />
              <input type="hidden" {...register('email')} />
              <input type="hidden" {...register('password')} />
            </>
          )}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : show2FA ? 'Verify Code' : 'Sign In'}
          </Button>
          {show2FA && (
            <Button
              variant="ghost"
              className="w-full"
              type="button"
              onClick={() => setShow2FA(false)}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          )}
        </form>
        {!show2FA && (
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
