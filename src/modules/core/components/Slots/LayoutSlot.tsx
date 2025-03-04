import { useEffect } from "react"
import { useLayoutSlots } from "../../hooks/useLayoutSlots"

interface Props {
	name: string
	children: React.ReactNode
}

export default function LayoutSlot({ name, children }: Props) {
	const { registerSlot, unregisterSlot } = useLayoutSlots()

	useEffect(() => {
		registerSlot(name, children)
		return () => unregisterSlot(name)
	}, [name, children, registerSlot, unregisterSlot])

	return null
}
