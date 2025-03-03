import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

export default function SimulationPage() {
	return (
		<>
      <LayoutSlot name="header">Header</LayoutSlot>
			<LayoutSlot name="title">Title</LayoutSlot>
			<div>SimulationPage</div>
		</>
	)
}
