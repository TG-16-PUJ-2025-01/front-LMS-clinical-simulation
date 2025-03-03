import { useContext, createContext } from "react";

export const SlotContext = createContext<{
	slots: Record<string, React.ReactNode>
	registerSlot: (name: string, node: React.ReactNode) => void
	unregisterSlot: (name: string) => void
}>({
	slots: {},
	registerSlot: () => {},
	unregisterSlot: () => {}
})

export function useSlots() {
	return useContext(SlotContext)
}
