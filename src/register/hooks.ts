import { useState, ChangeEvent } from 'react';
import axios from "../api";
import { create } from "zustand";

interface GetDataState<T = any> {
    loading: boolean;
    success: boolean;
    error: boolean;
    data: T | null;
    errorData: string | null;
  }
  
  interface PostRegisterState<T = any> extends GetDataState<T> {
    execute: (body: any) => Promise<void>;
  }
  
  const initialState: GetDataState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
  };

interface FormValues {
    name: string;
    email: string;
    password: string;
}




export const usePostRegister = create<PostRegisterState>((set) => ({
    ...initialState,
  
    execute: async (body: any) => {
      set({ ...initialState, loading: true });
      try {
        const response = await axios.post<{ data: any }>("auth/register", body);
        const data:any = response.data;
        set({ ...initialState, success: true, data: response.data });
        localStorage.setItem("tokens", data.tokens.access.token);
        localStorage.setItem("refreshToken", data.tokens.refresh.token);
        localStorage.setItem("userId", data.user.id);
      } catch (err: any) {
        console.error("Error in data fetch:", err);
        set({ 
          ...initialState, 
          error: true, 
          errorData: err.response.data.message || "Unknown error" 
        });
      }
    },
  }));

export const useRegister = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        name: "",
        email: "",
        password: "",
    });

    const handleChange =(event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };


    return {
        formValues,
        handleChange,
    };
 }