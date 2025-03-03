import { useEffect } from "react"
import { useSlots } from "../../hooks/useSlots"

interface Props {
	name: string
	children: React.ReactNode
}

export default function Slot({ name, children }: Props) {
	const { registerSlot, unregisterSlot } = useSlots()

	useEffect(() => {
		registerSlot(name, children)
		return () => unregisterSlot(name)
	}, [name, children, registerSlot, unregisterSlot])

	return null
}
