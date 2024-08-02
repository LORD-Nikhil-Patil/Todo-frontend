



import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { create } from "zustand";

import axios from "../api";

interface RequestParams {
    id?: string;
    data?: any;
    params?: any;
    force?: boolean;
    onSuccess?: (res: AxiosResponse) => void;
    onError?: (err: AxiosError) => void;
    onFinal?: () => void;
  }
  
  interface RequestOptions {
    onSuccess?: (res: AxiosResponse) => void;
    onError?: (err: AxiosError) => void;
    onFinal?: () => void;
  }

  interface RequestState {
    loading: boolean;
    success: boolean;
    error: boolean;
    data?: any;
    errorData?: AxiosError | null;
  }
  
  const initialState: RequestState = {
    loading: false,
    success: false,
    error: false,
    data: {},
    errorData: null,
  };
  
  interface StoreState extends RequestState {
    execute: (parameters?: RequestParams) => void;
  }
  
  export const request = ({ method, url }: AxiosRequestConfig, options?: RequestOptions) => {
    return create<StoreState>((set) => ({
      ...initialState,
  
      execute: (parameters: RequestParams = {}) => {
        const { id, data, params } = parameters;
        set({ ...initialState, loading: true });
       
        // if (!force && method === "GET" && Boolean(get().data)) {
        //   return;
        // }
        
        axios({
          method,
          url: url + (id || ""),
          data,
          params,
        })
          .then((res: AxiosResponse) => {
            set({ ...initialState, success: true, data: res.data });
            options?.onSuccess?.(res);
            parameters?.onSuccess?.(res);
          })
          .catch((err: any) => {
            set({ ...initialState, error: true, errorData: err?.response?.data?.message });
            options?.onError?.(err);
            parameters?.onError?.(err);
          })
          .finally(() => {
            options?.onFinal?.();
            parameters?.onFinal?.();
          });
      },
    }));
  };

  export const postTodo = request(
    {
      method: "POST",
      url: 'todos',
    },
  );

  export const getTodos = request(
    {
      method: "GET",
      url: 'todos',
    },
  );

  export const gtTodoById = request(
    {
      method: "GET",
      url: 'todos/',
    },
  );

  export const patchTodo = request(
    {
      method: "PATCH",
      url: 'todos/',
    },
  );

  export const deleteTodo = request(
    {
      method: "DELETE",
      url: 'todos/',
    },
  );