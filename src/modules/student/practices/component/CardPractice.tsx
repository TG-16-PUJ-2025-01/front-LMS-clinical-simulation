import { MoreHorizontal, Users, User, Calendar, SquarePlus } from "lucide-react"
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/modules/core/components/ui/tooltip"

type CardProps = React.ComponentProps<typeof Card> & {
	title: string
	description: string
	numberOfGroups: number | null
	maxStudentsGroup: number | null
	type: "GRUPAL" | "INDIVIDUAL"
	onClick?: () => void
	onEdit: () => void
	onDelete: () => void
}

export function CardPractice({
	className,
	title,
	description,
	numberOfGroups,
	maxStudentsGroup,
	type,
	onClick,
	onEdit,
	onDelete,
}: CardProps) {
	return (
		<TooltipProvider>
			<Card
				onClick={onClick}
				className={cn(
					"relative h-[300px] w-[300px] transform cursor-pointer overflow-hidden shadow-md transition-transform hover:scale-105",
					className
				)}
			>
				<div className="absolute top-2 right-2 z-10">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0 text-white"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation()
									onEdit()
								}}
							>
								<Calendar className="mr-2 h-4 w-4" /> Reservar Horario
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation()
									onDelete()
								}}
							>
								<SquarePlus className="mr-2 h-4 w-4" /> Unirse a Grupo
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<CardHeader className="bg-blue-javeriana h-3/5 p-0" />
				<CardContent className="flex flex-row items-end p-2">
					<div className="flex flex-1 flex-col gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex cursor-help items-center text-2xl">
									<CardTitle>{title}</CardTitle>
									{type === "GRUPAL" ? (
										<Users className="ml-2 h-5 w-5" />
									) : (
										<User className="ml-2 h-5 w-5" />
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								{type === "GRUPAL" ? (
									<span>
										<p>Práctica grupal</p>
										<p>Número de grupos: {numberOfGroups ?? "N/A"}</p>
										<p>Máximo estudiantes por grupo: {maxStudentsGroup ?? "N/A"}</p>
									</span>
								) : (
									<span>
										<p>Práctica individual</p>
									</span>
								)}
							</TooltipContent>
						</Tooltip>
						<CardDescription>{description}</CardDescription>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	)
}
