// pages/login.tsx
import AuthForm from "@/modules/core/"

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    console.log("Iniciar sesión con:", email, password);
    // Lógica para manejar el inicio de sesión
  };

  const handleForgotPassword = (email: string) => {
    console.log("Recuperar contraseña para:", email);
    // Lógica para manejar la recuperación de contraseña
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo: Contenedor del formulario */}
      <AuthForm onLogin={handleLogin} onForgotPassword={handleForgotPassword} />

      {/* Lado derecho: Imagen de fondo */}
      <div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/src/assets/img-login.jpg')" }}></div>
    </div>
  );
}