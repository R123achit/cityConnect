import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { data } = response.data;
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
          });
          
          toast.success('Login successful!');
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },
      
      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          const { data } = response.data;
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
          });
          
          toast.success('Registration successful!');
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        toast.success('Logged out successfully');
      },
      
      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/auth/profile', profileData);
          const { data } = response.data;
          
          set((state) => ({
            user: { ...state.user, ...data },
          }));
          
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...data }));
          toast.success('Profile updated successfully');
          return data;
        } catch (error) {
          toast.error('Failed to update profile');
          throw error;
        }
      },
      
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
