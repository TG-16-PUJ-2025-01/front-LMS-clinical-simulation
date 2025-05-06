// NavBar.tsx
import { UserNav } from "./UserNav";
import { Button } from "@/modules/core/components/ui/button";
import { useNavigate } from "react-router-dom";
import RoleSelect from "./RoleSelect";


interface NavLink {
	label: string;
	href: string;
}

interface NavBarProps {
	navLinks?: NavLink[]; // Se pasan solo los enlaces que se quieren mostrar
	showSelect?: boolean;
}

export default function NavBar({ showSelect = true, navLinks = [] }: NavBarProps) {
	const navigate = useNavigate();
	return (
		<header className="sticky top-0 left-0 z-50 w-full bg-white shadow-md">
			<div className="container mx-auto flex items-center justify-between px-4">
				{/* Left Elements */}
				<div className="flex items-center gap-8">
					{/* Logo */}
					<img src="/logo.svg" alt="Logo" className="h-14" />
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
					{showSelect && <RoleSelect />}
					{/* Avatar Button */}
					<UserNav />
				</div>
			</div>
		</header>
	);
}