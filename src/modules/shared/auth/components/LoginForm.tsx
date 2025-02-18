// components/LoginForm.tsx
import { useState } from "react";
import { Label } from "@/modules/core/components/ui/label";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { login } from "../services/authService"; // Importa el servicio de autenticación

interface LoginFormProps {
    onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null); // Estado para manejar errores

    const handleLogin = async (email: string, password: string) => {
        try {
            email = email + "@javeriana.edu.co";
            const { token } = await login(email, password); 
            console.log("Token recibido:", token);
            setError(null); 

            localStorage.setItem("token", token);
            window.location.href = "/admin/asignaturas"; 
        } catch (error) {
            setError( "Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            console.error("Error durante el inicio de sesión:", error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form
            className="w-full"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                console.log("Datos de inicio de sesión email:", email, "password:", password);

                handleLogin(email, password);
            }}
        >
            <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email" className="text-gray-700">Usuario</Label>
                    <Input id="email" name="email" type="text" placeholder="Usuario sin @javeriana.edu.co" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        >
                            {showPassword ? (
                                <EyeClosed className="h-5 w-5 text-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}
                <Button type="submit" className="w-full">Ingresar</Button>
                <div className="text-center text-sm text-gray-600">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="underline underline-offset-4"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
            </div>
        </form>
    );
}