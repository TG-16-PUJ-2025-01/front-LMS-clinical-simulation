import React, { useCallback, useState } from "react"
import { LayoutSlotContext } from "../../hooks/useLayoutSlots"

export function LayoutSlotProvider({ children }: { children: React.ReactNode }) {
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
		<LayoutSlotContext.Provider value={{ slots, registerSlot, unregisterSlot }}>
			{children}
		</LayoutSlotContext.Provider>
	)
}
