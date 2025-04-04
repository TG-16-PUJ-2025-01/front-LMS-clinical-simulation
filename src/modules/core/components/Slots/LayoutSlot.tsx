import { useEffect } from "react"
import { useLayoutSlots } from "../../hooks/useLayoutSlots"
import { useLocation } from "react-router-dom";

interface Props {
	name: string
	children: React.ReactNode
}

export default function LayoutSlot({ name, children }: Props) {
	const location = useLocation();
	const { registerSlot, unregisterSlot } = useLayoutSlots()

	useEffect(() => {
		registerSlot(name, children)
		return () => unregisterSlot(name)
	}, [name, children, registerSlot, unregisterSlot, location.pathname])

	return null
}
