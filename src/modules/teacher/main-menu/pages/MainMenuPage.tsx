import { useEffect, useState } from "react"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { Button } from "@/modules/core/components/ui/button"
import { getMenuInfo } from "../services/MainMenuService"

export default function MainMenuPage() {
	const [menuItems] = useState([
		{ id: 1, label: "Item 1", description: "Description for item 1" },
		{ id: 2, label: "Item 2", description: "Description for item 2" },
		// Add more items as needed
	])

	const handleMenuItemClick = (itemId: number) => {
		// Handle navigation or actions for the clicked menu item
		console.log(`Menu item ${itemId} clicked`)
	}

    const fetchMenuInfo = async () => {
        const info = await getMenuInfo()
        console.log(info)
    }

	useEffect(() => {
		// Fetch menu items from the backend
		fetchMenuInfo()
	}, [])

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Calendario",
							href: "/calendario",
						}
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Menú Principal</LayoutSlot>
			<div className="mb-4 flex justify-end">
				<Button onClick={() => console.log("Add new menu item")}>Agregar Item</Button>
			</div>
			<div className="flex justify-center">
				<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{menuItems.map((item) => (
						<div
							key={item.id}
							className="card"
							onClick={() => handleMenuItemClick(item.id)}
						>
							<h3>{item.label}</h3>
							<p>{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</>
	)
}
