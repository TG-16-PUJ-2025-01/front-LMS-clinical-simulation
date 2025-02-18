// components/RequestPasswordResetForm.tsx
import { useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { requestPasswordReset } from "../services/resetPasswordService";

interface RequestPasswordResetFormProps {
    onSuccess: (email : string) => void; 
}

export default function RequestPasswordResetForm({ onSuccess }: RequestPasswordResetFormProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await requestPasswordReset(email + "@javeriana.edu.co");
            setMessage("Se ha enviado un correo con las instrucciones para restablecer tu contraseña.");
            setError("");
            if (response === 200) {
                onSuccess(email + "@javeriana.edu.co"); // Llama a la función onSuccess para avanzar al siguiente paso
            }
        } catch (error) {
            setError("Error al solicitar el restablecimiento de contraseña.");
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <p>Ingresa tu usuario para restablecer tu contraseña.</p>
                <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Usuario sin @javeriana.edu.co"
                    required
                />
                {message && <p className="text-green-500 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit">Solicitar restablecimiento</Button>
            </div>
        </form>
    );
}