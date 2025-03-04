// components/AuthFlow.tsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import RequestEmailForm from "./RequestPasswordResetForm";
import VerifyCodeForm from "./VerifyPasswordResetForm";
import NewPasswordForm from "./ResetPasswordForm";

export default function AuthFlow() {
    const [authStep, setAuthStep] = useState<"login" | "requestEmail" | "verifyCode" | "newPassword">("login");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    const handleRequestEmail = async (email: string) => {
        try {
            setEmail(email);
            setAuthStep("verifyCode");
        } catch (error) {
            console.error("Error al solicitar el restablecimiento de contraseña:", error);
        }
    };

    const handleVerifyCode = async (token: string) => {
        try {
            setToken(token);
            setAuthStep("newPassword");
        } catch (error) {
            console.error("Error al verificar el código:", error);
        }
    };

    const handleNewPassword = async () => {
        try {
            setAuthStep("login");
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
        }
    };

    const handleBack = () => {
        if (authStep === "requestEmail") {
            setAuthStep("login");
        } else if (authStep === "verifyCode") {
            setAuthStep("requestEmail");
        } else if (authStep === "newPassword") {
            setAuthStep("verifyCode");
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
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
                        onSuccess={handleRequestEmail}
                        onBack={handleBack}
                    />
                )}
                {authStep === "verifyCode" && (
                    <VerifyCodeForm
                        email={email}
                        onSuccess={handleVerifyCode}
                        onBack={handleBack}
                    />
                )}
                {authStep === "newPassword" && (
                    <NewPasswordForm
                        email={email}
                        token={token}
                        onSuccess={handleNewPassword}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}