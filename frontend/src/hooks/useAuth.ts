import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { SignupFormData } from '../schemas/form/signup.form.schema';
import { LoginFormData } from '../schemas/form/login.form.schema';
import { SignupResponse, LoginResponse } from '../schemas/response/auth.response.schema';
import { useAuthStore } from '../store/authStore';

export const useSignup = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<SignupResponse, Error, Omit<SignupFormData, 'confirmPassword'>>({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        setAuth(data.data.user);
      }
    },
    onError: (error) => {
      console.error('Signup error:', error);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        setAuth(data.data.user);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      logout();
    },
  });
};

export const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  return { user, isAuthenticated, logout };
};
