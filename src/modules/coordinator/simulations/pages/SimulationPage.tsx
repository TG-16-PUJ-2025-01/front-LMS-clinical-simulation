import Slot from "@/modules/core/components/Slots/Slot"

export default function SimulationPage() {
	return (
		<>
      <Slot name="header">Header</Slot>
			<Slot name="title">Title</Slot>
			<div>SimulationPage</div>
		</>
	)
}
