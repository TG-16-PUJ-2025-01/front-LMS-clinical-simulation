import { useContext, createContext } from "react";

export const LayoutSlotContext = createContext<{
	slots: Record<string, React.ReactNode>
	registerSlot: (name: string, node: React.ReactNode) => void
	unregisterSlot: (name: string) => void
}>({
	slots: {},
	registerSlot: () => {},
	unregisterSlot: () => {}
})

export function useLayoutSlots() {
	return useContext(LayoutSlotContext)
}
