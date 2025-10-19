import axios from 'axios';
import { SignupFormData } from '../schemas/form/signup.form.schema';
import { LoginFormData } from '../schemas/form/login.form.schema';
import { SignupResponse, LoginResponse } from '../schemas/response/auth.response.schema';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3069/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: async (data: Omit<SignupFormData, 'confirmPassword'>): Promise<SignupResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default api;
