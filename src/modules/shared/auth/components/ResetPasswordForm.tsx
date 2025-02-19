import { useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { resetPassword } from "../services/resetPasswordService";

interface ResetPasswordFormProps {
    email: string; // El correo electrónico del usuario
    token: string; // El token de restablecimiento
    onSuccess: () => void; // Función para manejar el éxito
}

export default function ResetPasswordForm({ email, token, onSuccess }: ResetPasswordFormProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Expresión regular para validar una contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!passwordRegex.test(password)) {
            setError("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
            setMessage("");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setMessage("");
            return;
        }

        try {
            const response = await resetPassword(email, password, token);
            setMessage(response.message);
            setError("");
            onSuccess();
        } catch {
            setError("Error al restablecer la contraseña.");
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        required
                    />
                </div>

                <div className="relative">
                    <Input
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        required
                    />
                </div>

                {message && <p className="text-green-500 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <Button type="submit">Restablecer contraseña</Button>
            </div>
        </form>
    );
}
