// components/LoginForm.tsx
import { useState } from "react"
import { Label } from "@/modules/core/components/ui/label"
import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"
import { Eye, EyeClosed } from "lucide-react"
import { login } from "../services/authService" // Importa el servicio de autenticación
import { useNavigate } from "react-router-dom"
import Role from "@/modules/core/models/role"

interface LoginFormProps {
	onForgotPassword: () => void
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState<string | null>(null) // Estado para manejar errores
	const navigate = useNavigate()

	const handleLogin = async (email: string, password: string) => {
		try {
			const roles = await login(email, password)
			setError(null)

			if (roles.includes(Role.ADMIN)) {
				navigate("/admin/asignaturas")
			} else if (roles.includes(Role.COORDINADOR)) {
				navigate("/calendario") //FIXME
			} else if (roles.includes(Role.PROFESOR)) {
				navigate("/docente/asignaturas") // FIXME
			} else if (roles.includes(Role.ESTUDIANTE)) {
				navigate("/estudiante/asignaturas") // FIXME
			}
		} catch (error) {
			setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
			console.error("Error durante el inicio de sesión:", error)
		}
	}

	const toggleShowPassword = () => {
		setShowPassword(!showPassword)
	}

	return (
		<form
			className="w-full"
			onSubmit={(e) => {
				e.preventDefault()
				const formData = new FormData(e.currentTarget)
				const email = formData.get("email") as string
				const password = formData.get("password") as string
				handleLogin(email, password)
			}}
		>
			<div className="flex flex-col gap-6">
				<div className="grid gap-3">
					<Label htmlFor="email" className="text-gray-700">
						Usuario
					</Label>
					<Input id="email" name="email" type="email" placeholder="Correo registrado" required />
				</div>
				<div className="grid gap-3">
					<Label htmlFor="password" className="text-gray-700">
						Contraseña
					</Label>
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
							className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-sm leading-5"
						>
							{showPassword ? (
								<Eye className="h-5 w-5 text-gray-500" />
							) : (
								<EyeClosed className="h-5 w-5 text-gray-500" />
							)}
						</button>
					</div>
				</div>
				{error && <div className="text-center text-sm text-red-500">{error}</div>}
				<Button type="submit" className="w-full">
					Ingresar
				</Button>
				<div className="text-center text-sm text-gray-600">
					<button
						type="button"
						onClick={onForgotPassword}
						className="cursor-pointer underline underline-offset-4"
					>
						¿Olvidaste tu contraseña?
					</button>
				</div>
			</div>
		</form>
	)
}
