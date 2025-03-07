import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/modules/core/lib/utils"
import { Button } from "@/modules/core/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/core/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu"

type CardProps = React.ComponentProps<typeof Card>

export function CardPractice({ className, ...props }: CardProps) {
	const handleOpenDialog = (action: string, data: any) => {
		console.log(`${action} clicked`, data)
	}

	return (
		<Card className={cn("h-[300px] w-[300px] overflow-hidden", className)} {...props}>
			<CardHeader className="bg-blue-javeriana h-3/5 p-0" />

			<CardContent className="flex flex-row items-end p-2">
				<div className="flex flex-1 flex-col">
					<CardTitle className="text-2xl">Practica X</CardTitle>
					<CardDescription>Descripción de la práctica X con temáticasss hola hola hola hola hola hola hola hola hola hola.</CardDescription>
				</div>

				<div className="flex-shrink-0">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", {})}>
								<Pencil className="mr-2 h-4 w-4" /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", {})}>
								<Trash2 className="mr-2 h-4 w-4" /> Borrar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	)
}
