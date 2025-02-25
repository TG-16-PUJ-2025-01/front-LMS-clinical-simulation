import { API_URL } from "@/modules/core/config/env";
import { setToken } from "@/modules/core/lib/tokenHandler";
import axios from "axios";


interface LoginData {
  email: string;
  password: string;
}

interface ChangePasswordData {
  password: string;
  newPassword: string;
}

export const login = async (email: string, password: string) => {
  try {
    const loginData: LoginData = { email, password };
    const response = await axios.post<string>(`${API_URL}/auth/login`, loginData);
    setToken(response.data); 
  } catch (error) {
    console.error("Error durante el login:", error);
    throw new Error("Error durante el login");
  }
};

export const changePassword = async (password: string, newPassword: string) => {
  try {
    const changePasswordData: ChangePasswordData = { password, newPassword };
    const response = await axios.post<string>(`${API_URL}/auth/change-password`, changePasswordData);
    setToken(response.data.toString()); 
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    throw new Error("Error al cambiar la contraseña");
  }
};
