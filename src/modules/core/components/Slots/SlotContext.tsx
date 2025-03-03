import React, { useCallback, useState } from "react"
import { SlotContext } from "../../hooks/useSlots"

export function SlotProvider({ children }: { children: React.ReactNode }) {
	const [slots, setSlots] = useState<Record<string, React.ReactNode>>({})

	const registerSlot = useCallback((name: string, node: React.ReactNode) => {
		setSlots((prev) => ({ ...prev, [name]: node }))
	}, [])

	const unregisterSlot = useCallback((name: string) => {
		setSlots((prev) => {
      const newSlots = { ...prev }
      delete newSlots[name]
      return newSlots
		})
	}, [])

	return (
		<SlotContext.Provider value={{ slots, registerSlot, unregisterSlot }}>
			{children}
		</SlotContext.Provider>
	)
}
