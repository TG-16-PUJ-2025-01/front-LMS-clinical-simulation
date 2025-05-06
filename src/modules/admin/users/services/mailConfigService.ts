import axios from 'axios';
import { API_URL } from '@/modules/core/config/env';

export async function updateMailConfig(host: string, username: string, password: string ) {
    const mailConfig = {
        host,
        username,
        password,
    };
    try {
        const { data } = await axios.post(`${API_URL}/mail/config`, mailConfig);
        return data;
    }
    catch (error) {
        console.error("Error al enviar la configuración del correo:", error);
        throw new Error("Error al enviar la configuración del correo");
    }
}