// services/resetPasswordService.ts
import axios from 'axios';
import { API_URL } from "@/modules/core/config/env";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

interface ResetPasswordResponse {
    message: string;
}

interface PasswordResetData {
    email: string;
    password?: string | null;
    token?: string | null;
}

export const requestPasswordReset = async (email: string): Promise<number> => {
    try {
        const response = await axiosInstance.post('/reset-password/request', { email });
        return response.status;
    } catch (error) {
        console.error("Error requesting password reset:", error);
        throw error;
    }
};

export const verifyPasswordReset = async (email: string, token: string): Promise<number> => {
    try {
        const password = null;
        const passwordResetData : PasswordResetData = { email, password, token };
        console.log("passwordResetData", passwordResetData);
        const response = await axiosInstance.post('/reset-password/verify', passwordResetData);
        return response.status;
    } catch (error) {
        console.error("Error verifying password reset token:", error);
        throw error;
    }
};

export const resetPassword = async (email: string, password: string, token: string): Promise<ResetPasswordResponse> => {
    try {
        const passwordResetData : PasswordResetData = { email, password, token };
        const response = await axiosInstance.post<ResetPasswordResponse>('/reset-password/reset', passwordResetData);
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};