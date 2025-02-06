import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"

export default function Login() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<form
				onSubmit={() => {}}
				className="flex w-1/2 max-w-80 flex-col items-center gap-4 rounded-lg border border-black bg-white p-4 shadow-md"
			>
				<Input placeholder="Correo"></Input>
				<Input placeholder="Contraseña" type="password"></Input>
				<Button className="w-full">Login</Button>
			</form>
		</main>
	)
}
