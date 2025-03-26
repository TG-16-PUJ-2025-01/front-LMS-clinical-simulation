import { cn } from "@/modules/core/lib/utils"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/core/components/ui/card"
import Class from "@/modules/core/models/class"

type CardProps = React.ComponentProps<typeof Card> & {
	classData: Class
	onClick?: () => void
}

export function CardClass({ classData, onClick }: CardProps) {
	return (
		<Card
			onClick={onClick}
			className={cn(
				"relative h-[300px] w-[300px] transform cursor-pointer overflow-hidden shadow-md transition-transform hover:scale-105"
			)}
		>
			<CardHeader className="bg-blue-javeriana h-3/5 p-0" />
			<CardContent className="flex flex-row items-end p-2">
				<div className="flex flex-1 flex-col gap-2">
					<CardTitle>
						{classData.course.name} - {classData.course.javerianaId} - {classData.period}
					</CardTitle>
					<CardDescription>
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
