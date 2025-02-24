"use client"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/core/components/ui/popover"

interface ComboboxCreateProps {
  options: { key?: number; value: string }[]
  onCreateOption: (option: { key: number; value: string }) => void
  placeholderText?: string
  itemName?: string
  onChange?: (selected: { key?: number; value: string }) => void;
}

export function ComboboxCreate({
  options,
  onCreateOption,
  placeholderText = "Seleccionar...",
  itemName = "Tipo",
  onChange,
}: ComboboxCreateProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [inputValue, setInputValue] = React.useState("")
  const [filteredOptions, setFilteredOptions] = React.useState(options)

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)
    onChange && onChange({ value: currentValue })
    
  }

  const handleCreateOption = () => {
    const newOption = { key: Date.now(), value: inputValue }
    onCreateOption(newOption)
    setValue(newOption.value === value ? "" : newOption.value)
    onChange && onChange({ value: newOption.value })
    setOpen(false)
  }

  React.useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.value.toLowerCase().includes(inputValue.toLowerCase())
      )
    )
  }, [inputValue, options])

  const popoverWidth = filteredOptions.length === 0 ? Math.max(300, (inputValue.length + itemName.length + 30) * 10) : 300

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
      <PopoverContent style={{ width: popoverWidth }} className="p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${itemName}...`}
            className="h-9"
            value={inputValue}
            onValueChange={(val) => setInputValue(val)}
          />
          <CommandList>
            {filteredOptions.length === 0 && (
              <CommandEmpty>
                <Button variant="link" onClick={handleCreateOption}>
                  No se encontró el {itemName}. Crear "{inputValue}"
                </Button>
              </CommandEmpty>
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
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
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
