import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/modules/core/lib/utils"
import { Button } from "@/modules/core/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/modules/core/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover"
import { useEffect, useState } from "react"

interface ComboboxSelectProps {
	options: { key?: number; value: string }[]
	placeholderText?: string
	itemName?: string
	onChange?: (selected?: { key?: number; value: string }) => void
	selectedValue?: string
	className?: string
	filter?: string
	setFilter?: (filter: string) => void
}

export function Combobox({
	options,
	placeholderText = "Seleccionar...",
	itemName = "Tipo",
	onChange,
	selectedValue = "",
	className,
	filter = "",
	setFilter,
}: ComboboxSelectProps) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState<string | null>(selectedValue)
	const [inputValue, setInputValue] = useState("")
	const [filteredOptions, setFilteredOptions] = useState(options)

	const handleSelect = (current: { value: string; key?: number }) => {
		setValue(current.value === value ? "" : current.value)
		setOpen(false)

		if (onChange) {
			onChange(current.value === value ? undefined : current)
		}
	}

	useEffect(() => {
		setFilteredOptions(
			options.filter((option) => option.value.toLowerCase().includes(inputValue.toLowerCase()))
		)
	}, [inputValue, options])

	useEffect(() => {
		setValue(selectedValue)
	}, [selectedValue])

	useEffect(() => {
		setInputValue(filter)
	}, [filter])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("col-span-3 justify-between truncate max-w-full", className)}
				>
					{value
						? options.find((option) => option.value === value)?.value || value
						: placeholderText}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0">
				<Command>
					<CommandInput
						placeholder={`Buscar ${itemName}...`}
						className="h-9"
						value={inputValue}
						onValueChange={(val) => {
							if (setFilter) {
								setFilter(val)
							} else {
								setInputValue(val)
							}
						}}
					/>
					<CommandList>
						{filteredOptions.length === 0 && (
							<CommandEmpty>No se encontraron resultados</CommandEmpty>
						)}
						<CommandGroup>
							{filteredOptions.map((option) => (
								<CommandItem
									key={option.key}
									value={option.value}
									onSelect={() => handleSelect(option)}
								>
									{option.value}
									<Check
										className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
