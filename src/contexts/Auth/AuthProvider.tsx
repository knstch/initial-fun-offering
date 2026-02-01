import axios from "axios";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import type {operations} from "users-ido-api/public/generated/users.public";
import { useSnackbar } from "../Snackbar/SnackbarContext";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface User {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
    profilePicture: string;
}

type AuthViaGoogleOp = operations["Users_AuthViaGoogle"];
type AuthViaGoogleParams = AuthViaGoogleOp["parameters"]["query"];
type GetUserOp = operations["Users_GetUser"];
type GetUserResponse = GetUserOp["responses"]["200"]["schema"];
type RefreshAccessTokenOp = operations["Users_RefreshAccessToken"];
type RefreshAccessTokenResponse = RefreshAccessTokenOp["responses"]["200"]["schema"];
type RefreshAccessTokenParams = RefreshAccessTokenOp["parameters"]["body"];

interface AuthContextType {
    signIn: () => void;
    signOut: () => void;
    refreshTokens: () => void;
    getAccessToken: () => string | null;
    user?: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const auth = useProvideAuth();
    
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
    };
    return null;
};

const useProvideAuth = () => {
    const { showSnackbar } = useSnackbar();

    const [user, setUser] = useState<User>();
    const usersHost = process.env.REACT_APP_USERS_HOST;

    const getAccessToken = useCallback(() => {
        return getCookie("access_token");
    }, []);

    const loadUser = useCallback(async () => {
        const accessToken = getCookie("access_token");
        const refreshToken = getCookie("refresh_token");
        if (!accessToken) {
            if (refreshToken) {
                try {
                    await refreshAccessToken(refreshToken, usersHost || "");
                    loadUser();
                } catch (refreshError) {
                    deleteCookie("access_token");
                    deleteCookie("refresh_token");
                }
            }
            return;
        }

        try {
            const resp = await axios.get<GetUserResponse>(`${usersHost}/getUser`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });

            if (resp.status === 200) {
                const data = resp.data;
                if (data.ID && data.email && data.first_name && data.last_name) {
                    setUser({
                        id: Number(data.ID),
                        email: data.email,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        profilePicture: data.profile_picture || "",
                    });
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                const refreshToken = getCookie("refresh_token");
                if (refreshToken) {
                    try {
                        await refreshAccessToken(refreshToken, usersHost || "");
                        loadUser();
                    } catch (refreshError) {
                        deleteCookie("access_token");
                        deleteCookie("refresh_token");
                        setUser(undefined);
                        showSnackbar("An unexpected error occured, please, sign in again.", 'error');
                    }
                }
            } else {
                showSnackbar("An error occurred while getting profile info, please try again.", 'error');
            }
        }
    }, [showSnackbar, usersHost]);

    const refreshTokens = useCallback(async () => {
        const refreshToken = getCookie("refresh_token");
        if (refreshToken) {
            try {
                await refreshAccessToken(refreshToken, usersHost || "");
            } catch (refreshError) {
                deleteCookie("access_token");
                deleteCookie("refresh_token");
                setUser(undefined);
                showSnackbar("An unexpected error occured, please, sign in again.", 'error');
            }
        }
    }, [usersHost]);

    const deleteCookie = (name: string, path: string = "/", domain?: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; ${
            domain ? `domain=${domain};` : ""
        } SameSite=Lax;`;
    };

    useEffect(() => {
        loadUser();
    }, []);

    const signIn = useCallback(() => {
        const params: AuthViaGoogleParams = {
            location: window.location.pathname,
        }

        const url = new URL(`${usersHost}/authViaGoogle`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const finalUrl = url.toString();

        setTimeout(() => {
            window.location.href = finalUrl;
        }, 100);
    }, [usersHost]);

    const signOut = useCallback(() => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        setUser(undefined);
    }, []);

    return {
        signIn,
        signOut,
        refreshTokens,
        getAccessToken,
        user,
    }
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

const refreshAccessToken = async (refreshToken: string, usersHost: string) => {
    try {
        const params: RefreshAccessTokenParams = {
            body: {
                refresh_token: refreshToken,
            }
        };

        const resp = await axios.post<RefreshAccessTokenResponse>(`${usersHost}/refreshAccessToken`, params.body, {
            withCredentials: true,
        });
        return resp.data;
    } catch (error) {
        throw error;
    }
}