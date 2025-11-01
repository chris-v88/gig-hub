import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { signupFormSchema, SignupFormData } from '../schemas/form/signup.form.schema';
import { useSignup } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/ui/Icon';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Brazil',
  'India',
  'Japan',
  'South Korea',
  'Mexico',
  'Argentina',
  'Other',
];

const SignupPage = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      const result = await signupMutation.mutateAsync(signupData);

      if (result.success) {
        navigate('/');
      }
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((errorMsg: string) => {
          if (errorMsg.includes('email')) {
            setError('email', { message: errorMsg });
          } else if (errorMsg.includes('username')) {
            setError('username', { message: errorMsg });
          } else {
            setError('root', { message: errorMsg });
          }
        });
      } else if (error.response?.data?.message) {
        setError('root', { message: error.response.data.message });
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Icon name="Users" className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Join GigHub</h2>
          <p className="mt-2 text-sm text-gray-600">Start your freelancing journey today</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Root Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <Icon name="AlertCircle" className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.root.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              {...register('name')}
              error={errors.name?.message as string}
            />

            {/* Username */}
            <Input
              label="Username"
              type="text"
              placeholder="Choose a unique username"
              {...register('username')}
              error={errors.username?.message as string}
              helperText="This will be your unique identifier on GigHub"
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              error={errors.email?.message as string}
            />

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                {...register('country')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.country ? 'border-red-300 text-red-900' : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country?.message as string}</p>
              )}
            </div>

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              {...register('password')}
              error={errors.password?.message as string}
              helperText="Must contain at least 8 characters with uppercase, lowercase, and numbers"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message as string}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              tone="primary"
              className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
              isLoading={isSubmitting || signupMutation.isPending}
            >
              {isSubmitting || signupMutation.isPending ? 'Creating Account...' : 'Join GigHub'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center">
              By joining, you agree to GigHub&apos;s{' '}
              <Link to="/terms" className="text-green-600 hover:text-green-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-600 hover:text-green-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
