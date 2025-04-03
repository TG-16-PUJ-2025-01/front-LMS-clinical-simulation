import { cn } from "@/modules/core/lib/utils"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/modules/core/components/ui/card"
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
} from "@/modules/core/components/ui/tooltip"

type CardProps = React.ComponentProps<typeof Card> & {
	title: string
	professor: string
	onClick?: () => void
}

export function CardClass({
	className,
	title,
	professor,
	onClick,
}: CardProps) {
	return (
		<TooltipProvider>
			<Card
				onClick={onClick}
				className={cn(
					"relative h-[300px] w-[300px] transform cursor-pointer overflow-hidden transition-transform hover:scale-105",
					className
				)}
			>

                <CardHeader className="bg-blue-javeriana h-3/5 p-0" />
                <CardContent className="flex flex-row items-end p-2">
                    <div className="flex flex-1 flex-col gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex cursor-help items-center text-2xl">
                                    <CardTitle>{title}</CardTitle>
                                </div>
                            </TooltipTrigger>
                        </Tooltip>
                        <CardDescription>{professor}</CardDescription>
                    </div>
                </CardContent>
			</Card>
		</TooltipProvider>
	)
}
