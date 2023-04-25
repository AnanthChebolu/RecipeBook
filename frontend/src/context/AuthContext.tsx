import React, { createContext, useContext, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export type AuthContextType = {
    token: string | null;
    setToken: (v: string | null) => void;
    getAxiosConfig: () => AxiosRequestConfig<any>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: (v: string | null) => {},
    getAxiosConfig: () => {
        return {};
    }
});

interface AuthContextProviderProps {
    children?: React.ReactNode;
}

const AuthContextProvider: React.FunctionComponent<AuthContextProviderProps> = (
    props: AuthContextProviderProps
) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const setTokenLocalStorage = (token: string | null) => {
        setToken(token);
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    };

    /**
     * This function should be called everytime you make an axios http request and provide this is as the config
     * argument. Example:
     *
     * const config = getAxiosConfig();
     * http.get('<url', {}, config);
     */
    const getAxiosConfig = (): AxiosRequestConfig => {
        if (!token) return {};

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    return (
        <AuthContext.Provider value={{ token, setToken: setTokenLocalStorage, getAxiosConfig }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
