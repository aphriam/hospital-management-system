import { createContext, useEffect, useState } from "react";import api from "../services/api";


export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken")
);
useEffect(() => {

    const loadUser = async () => {

        if (!accessToken) return;

        try {

            const response = await api.get("me/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setUser(response.data);

        } catch (error) {

            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setUser(null);

        }
    };

    loadUser();

}, [accessToken]);

    const login = async (username, password) => {

    // Step 1: Get JWT tokens
    const tokenResponse = await api.post("token/", {
        username,
        password,
    });

    const token = tokenResponse.data.access;

    // Step 2: Get logged-in user information
    const userResponse = await api.get("me/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Step 3: Store user and token
    setUser(userResponse.data);
    setAccessToken(token);

    localStorage.setItem("accessToken", token);

    return userResponse.data;
};
    const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
};

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};