import * as React from "react"
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

interface ComboboxSelectProps {
	options: { key?: number; value: string }[]
	placeholderText?: string
	itemName?: string
	onChange?: (selected: { key?: number; value: string }) => void
	selectedValue?: string
}

export function Combobox({
	options,
	placeholderText = "Seleccionar...",
	itemName = "Tipo",
	onChange,
	selectedValue = "",
}: ComboboxSelectProps) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(selectedValue)
	const [inputValue, setInputValue] = React.useState("")
	const [filteredOptions, setFilteredOptions] = React.useState(options)

	const handleSelect = (currentValue: string) => {
		setValue(currentValue === value ? "" : currentValue)
		setOpen(false)
		const result = options.find((option) => option.value === currentValue)
		
		onChange && onChange({ value: currentValue, key: result?.key })
		//console.log("Combobox.tsx: Combobox -> result", result)
	}

	React.useEffect(() => {
		setFilteredOptions(
			options.filter((option) => option.value.toLowerCase().includes(inputValue.toLowerCase()))
		)
	}, [inputValue, options])

	React.useEffect(() => {
		setValue(selectedValue)
	}, [selectedValue])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="col-span-3 justify-between"
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
						onValueChange={(val) => setInputValue(val)}
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
									onSelect={() => handleSelect(option.value)}
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
