import { AxiosError } from 'axios';
import axios from '../api'
import { ChangeEvent, useState } from 'react';
import create from 'zustand';

interface DataState {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: any[] | null;
  errorData: string | null | any;
  execute: (body?: any) => Promise<void>; // Allow an optional body parameter
}

const initialState: Omit<DataState, 'execute'> = {
  loading: false,
  success: false,
  error: false,
  data: null,
  errorData: null,
};

export const useLogIn = create<DataState>((set, get) => ({
  ...initialState,

  execute: async (body?: any) => { 
    set({ ...initialState, loading: true });
    try {
      const res = await axios.post('auth/login', body);
      set({ ...initialState, success: true, data: res.data });
      localStorage.setItem("tokens", res.data.tokens.access.token);
      localStorage.setItem("refreshToken", res.data.tokens.refresh.token);
      localStorage.setItem("userId", res.data.user.id);
    } catch (err: any) {
      console.log('Error in data fetch:', err);
      set({ 
        ...initialState, 
        error: true, 
        errorData: err.response.data.message || "Unknown error" 
      });
    }
  },
}));



export const useFormInput = () => {
    const [formValues, setValue] = useState({
        email: "",
        password: ''
    });
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      setValue({
        ...formValues,
        [name]: value
      });
    };

    return {
      formValues,
      handleChange
    };
  };