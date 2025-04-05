import { cn } from "@/modules/core/lib/utils"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/core/components/ui/card"
import Class from "@/modules/core/models/class"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/modules/core/components/ui/dropdown-menu"
import { Button } from "@/modules/core/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

type CardProps = React.ComponentProps<typeof Card> & {
	classData: Class
	onClick?: () => void
	onEdit: () => void
	onDelete: () => void
}

export function CardClassTeacher({ classData, onClick, onEdit, onDelete }: CardProps) {
	return (
		<Card
			onClick={onClick}
			className={cn(
				"relative h-[300px] w-[300px] transform cursor-pointer overflow-hidden shadow-md transition-transform hover:scale-105"
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
											<Pencil className="mr-2 h-4 w-4" /> Editar
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation()
												onDelete()
											}}
										>
											<Trash2 className="mr-2 h-4 w-4" /> Borrar
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							
			<CardHeader className="bg-blue-javeriana h-3/5 p-0" />
			<CardContent className="flex flex-row items-end p-2">
				<div className="flex flex-1 flex-col gap-2 text-xl">
					<CardTitle>
						{classData.course.name} - {classData.course.javerianaId}
					</CardTitle>
					<CardDescription>
						<p>
							<strong>Periodo:</strong> {classData.period}
						</p>
						<p>
							<strong>Profesores:</strong> {classData.professors.map((p) => p.name).join(", ")}
						</p>
						<p>
							<strong>Número de Clase:</strong> {classData.javerianaId}
						</p>
					</CardDescription>
				</div>
			</CardContent>
		</Card>
	)
}
