import { Bell } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/modules/core/components/ui/select"
import { UserNav } from "./UserNav"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/modules/core/components/ui/tooltip"
import { Button } from "@/modules/core/components/ui/button"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { useNavigate } from "react-router-dom"

interface NavLink {
	label: string
	href: string
}

interface NavBarProps {
	navLinks?: NavLink[] // Se pasan solo los enlaces que se quieren mostrar
	showSelect?: boolean
}

export default function NavBar({ showSelect = true, navLinks = [] }: NavBarProps) {
	const navigate = useNavigate()
	return (
		<header className="sticky top-0 left-0 z-50 w-full bg-white shadow-md">
			<div className="container mx-auto flex items-center justify-between px-4">
				{/* Left Elements */}
				<div className="flex items-center gap-8">
					{/* Logo */}
					<img src="/src/assets/logo.svg" alt="Logo" className="h-14" />
					{/* Nav */}
					<nav className="hidden gap-6 md:flex">
						{navLinks.map((link) => (
							<Button
								key={link.href}
								variant="link"
								className="hover:text-primary p-0 text-xs transition-colors xl:text-sm"
								onClick={() => navigate(link.href)}
							>
									{link.label}
							</Button>
						))}
					</nav>
				</div>

				{/* Right Elements */}
				<div className="flex items-center gap-4">
					{/* Role Select */}
					{showSelect && (
						<Select>
							<SelectTrigger className="mr-2 cursor-pointer">
								<SelectValue placeholder="Rol" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Rol</SelectLabel>
									<SelectItem value="estudiante">Estudiante</SelectItem>
									<SelectItem value="profesor">Profesor</SelectItem>
									<SelectItem value="administrador">Administrador</SelectItem>
									<SelectItem value="coordinador">Coordinador</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
					{/* Bell Button */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button className="mr-2 cursor-pointer" variant="ghost" size="icon">
									<Bell className="h-5 w-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Notificaciones</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{/* Avatar Button */}
					<UserNav />
				</div>
			</div>
		</header>
	)
}
