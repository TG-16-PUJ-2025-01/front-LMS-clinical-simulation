// services/authService.ts
import axios from 'axios';
import { API_URL } from "@/modules/core/config/env";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const loginData: LoginData = { email, password };
        const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                throw new Error(error.response.data.message || "Error during login");
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("No response received from the server");
            } else {
                console.error("Error setting up the request:", error.message);
                throw new Error("Error setting up the request");
            }
        } else {
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred");
        }
    }
};