import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Read from localStorage immediately
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const parsedUser = JSON.parse(user);
      console.log('🔄 Initial state from localStorage:', parsedUser.email, parsedUser.role);
      return {
        user: parsedUser,
        token: token,
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error('Error reading initial state:', error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

const initialState = getInitialState();

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      
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
        
        console.log('🔐 initializeAuth called');
        console.log('  - Token exists:', !!token);
        console.log('  - User exists:', !!user);
        console.log('  - Token value:', token?.substring(0, 20) + '...');
        console.log('  - User value:', user);
        
        if (token && user) {
          try {
            const parsedUser = JSON.parse(user);
            console.log('✅ Parsed user:', parsedUser);
            console.log('  - Email:', parsedUser.email);
            console.log('  - Role:', parsedUser.role);
            
            set({
              token,
              user: parsedUser,
              isAuthenticated: true,
            });
            
            console.log('✅ State updated - isAuthenticated: true');
          } catch (error) {
            console.error('❌ Invalid user data in localStorage:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } else {
          console.log('⚠️ No auth data found in localStorage');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
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
