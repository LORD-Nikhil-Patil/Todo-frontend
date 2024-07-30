import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';

export const useLocalStorage = <T,>(keyName: string, defaultValue: T): [T, (newValue: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
      try {
        const value = localStorage.getItem(keyName);
        if (value) {
          return value as T;
        } else {
          localStorage.setItem(keyName, JSON.stringify(defaultValue));
          return defaultValue;
        }
      } catch (err) {
        console.error('Error accessing localStorage:', err);
        return defaultValue;
      }
    });

    const setValue = (newValue: T): void => {
      try {
        localStorage.setItem(keyName, JSON.stringify(newValue));
      } catch (err) {
        console.error('Error setting localStorage:', err);
      }
      setStoredValue(newValue);
    };

    return [storedValue, setValue];
};

interface AuthContextType {
    user: any;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useLocalStorage('tokens', null);
    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        navigate('/', { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) {
      return <Navigate  to="/login" replace state={{ path: location.pathname }}/>;
    }
    
    return <>{children}</>;
  };