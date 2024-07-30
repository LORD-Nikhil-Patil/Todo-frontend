import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'https://my-todos-app-w2pj.onrender.com/v1/',
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        const token = localStorage.getItem('tokens');
        if (token) {
            (config as any).headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('Refresh token is missing');
                }

                const response = await axios.post('http://localhost:3000/v1/auth/refresh-tokens', { refreshToken });
                console.log("Refresh token", response)
                const { access, refresh } = response.data;
                localStorage.setItem('tokens', access.token);
                localStorage.setItem('refreshToken', refresh.token);

                instance.defaults.headers.common['Authorization'] = `Bearer ${access.token}`;

                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export function setAuthToken(token: string) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
