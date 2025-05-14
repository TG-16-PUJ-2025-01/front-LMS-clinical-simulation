// components/ResetPasswordForm.tsx
import { useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { resetPassword } from "../services/resetPasswordService";
import { validatePassword } from "@/modules/core/lib/utils";

interface ResetPasswordFormProps {
    email: string;
    token: string;
    onSuccess: () => void;
    onBack: () => void; // Nueva prop para manejar el retroceso
}

export default function ResetPasswordForm({ email, token, onSuccess, onBack }: ResetPasswordFormProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validatePassword(password)) {
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
            setError("Error al restablecer la contraseña. Por favor, inténtalo de nuevo.");
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
                
                <div className="flex flex-col gap-2">
                    <Button type="submit">Restablecer contraseña</Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                        Volver
                    </Button>
                </div>
            </div>
        </form>
    );
}