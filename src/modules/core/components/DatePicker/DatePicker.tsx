import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"

interface Props {
  id: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  min?: Date
  max?: Date
  className?: string
}

export default function DatePicker({ id, selected, onSelect, min, max, className }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {selected ? selected.toLocaleDateString() : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          disabled={(date) => (min ? date < min : false) || (max ? date > max : false)}
        />
      </PopoverContent>
    </Popover>
  )
}
