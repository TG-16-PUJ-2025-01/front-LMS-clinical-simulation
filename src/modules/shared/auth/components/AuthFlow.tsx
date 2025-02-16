// components/AuthFlow.tsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import RequestEmailForm from "./RequestEmailForm";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm";

export default function AuthFlow() {
    const [authStep, setAuthStep] = useState<"login" | "requestEmail" | "verifyCode" | "newPassword">("login");

    const handleRequestEmail = (email: string) => {
        console.log("Correo solicitado:", email);
        setAuthStep("verifyCode"); // Cambia al paso de verificación de código
    };

    const handleVerifyCode = (code: string) => {
        console.log("Código verificado:", code);
        setAuthStep("newPassword"); // Cambia al paso de nueva contraseña
    };

    const handleNewPassword = (newPassword: string) => {
        console.log("Nueva contraseña:", newPassword);
        setAuthStep("login"); // Vuelve al formulario de inicio de sesión
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
            {/* Logo y título (común para todos los pasos) */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <img
                    src="/src/assets/logo-javeriana2.svg"
                    className="w-80 h-full"
                    alt="Logo Javeriana"
                />
            </div>
            <div className="w-full max-w-md">
                {authStep === "login" && (
                    <LoginForm onForgotPassword={() => setAuthStep("requestEmail")} />
                )}
                {authStep === "requestEmail" && (
                    <RequestEmailForm
                        onSubmit={handleRequestEmail}
                    />
                )}
                {authStep === "verifyCode" && (
                    <VerifyCodeForm
                        onSubmit={handleVerifyCode}
                    />
                )}
                {authStep === "newPassword" && (
                    <NewPasswordForm
                        onSubmit={handleNewPassword}
                    />
                )}
            </div>
        </div>
    );
}