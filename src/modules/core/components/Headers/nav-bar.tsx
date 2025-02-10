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
import { UserNav } from "./user-nav"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/modules/core/components/ui/tooltip"
import { Button } from "@/modules/core/components/ui/button"
import { TooltipProvider } from "@radix-ui/react-tooltip"

interface NavLink {
	label: string
	href: string
}

interface NavBarProps {
	navLinks?: NavLink[] // Se pasan solo los enlaces que se quieren mostrar
	showSelect?: boolean
}

export default function NavBar({ showSelect = true, navLinks = [] }: NavBarProps) {
	return (
		<header className="w-full bg-white shadow-md">
			<div className="container mx-auto flex items-center justify-between p-1">
				{/* Left Elements */}
				<div className="flex items-center gap-4">
					{/* Logo */}
					<img
						src="/src/assets/logo.svg"
						alt="Logo"
						className="mr-8 h-15 w-15"
					/>
					{/* Nav */}
					<nav className="hidden gap-8 md:flex">
						{navLinks.map((link, index) => (
							<Button variant={"link"} asChild>
								<a
									key={index}
									href={link.href}
									className="hover:text-primary text-sm font-medium transition-colors"
								>
									{link.label}
								</a>
							</Button>
						))}
					</nav>
				</div>

				{/* Right Elements */}
				<div className="flex items-center gap-4">
					{/* Role Select */}
					{showSelect && (
						<Select>
							<SelectTrigger className="mr-2 w-[180px] cursor-pointer">
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
