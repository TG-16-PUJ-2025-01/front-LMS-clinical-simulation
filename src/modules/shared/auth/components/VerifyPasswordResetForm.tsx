import { useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/modules/core/components/ui/input-otp";
import { verifyPasswordReset } from "../services/resetPasswordService";

interface VerifyPasswordResetFormProps {
    email: string;
    onSuccess: (token: string) => void;
}

export default function VerifyPasswordResetForm({ email, onSuccess }: VerifyPasswordResetFormProps) {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("email", email);
        try {
            const response = await verifyPasswordReset(email, token);
            if (response === 200) {
                setMessage("Token verificado correctamente.");
                setError("");
                onSuccess(token);
            } else {
                setError("Token inválido o expirado.");
                setMessage("");
            }
        } catch (error) {
            setError("Token inválido o expirado.");
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 w-full max-w-md">
                <p>Ingresa el código que recibiste en tu correo.</p>
                <div className="w-full flex justify-center">
                    <InputOTP
                        maxLength={6}
                        name="code"
                        value={token}
                        onChange={(value) => setToken(value)}
                        className="w-full max-w-md h-17"
                    >
                        <InputOTPGroup className="w-full flex justify-center gap-4">
                            {[...Array(3)].map((_, index) => (
                                <InputOTPSlot key={index} index={index} className="w-14 h-14 text-center text-xl border rounded-lg" />
                            ))}
                            <span className="flex items-center justify-center text-xl">-</span> {/* Guion en medio */}
                            {[...Array(3)].map((_, index) => (
                                <InputOTPSlot key={index + 3} index={index + 3} className="w-14 h-14 text-center text-xl border rounded-lg" />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                {message && <p className="text-green-500 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit">Verificar el código</Button>
            </div>
        </form>
    );
}