import { axiosInstance } from './axiosInstance';
import { SignupFormData } from '../schemas/form/signup.form.schema';
import { LoginFormData } from '../schemas/form/login.form.schema';
import { SignupResponse, LoginResponse } from '../schemas/response/auth.response.schema';

export const authAPI = {
  signup: async (data: Omit<SignupFormData, 'confirmPassword'>): Promise<SignupResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // Add auth check endpoint for session validation
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user?: unknown }> => {
    const response = await axiosInstance.get('/auth/check');
    return response.data;
  },
};

export default authAPI;
