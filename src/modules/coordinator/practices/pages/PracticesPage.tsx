import { useEffect, useState } from "react";
import { CardPractice } from "../components/CardPractice";
import NavBar from "@/modules/core/components/Headers/NavBar";
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot";
import { getAllPractices } from "../services/PracticeService";
import Practice from "@/modules/core/models/practice";
import { Button } from "@/modules/core/components/ui/button";

export default function PracticesPage() {
	const [practices, setPractices] = useState<Practice[]>([]);

	useEffect(() => {
		const fetchPractices = async () => {
			const response = await getAllPractices(0, 10, "", "name", true);
			setPractices(response.data);
		};
		fetchPractices();
	}, []);

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "aqui",
							href: "coordinador/practicas",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Prácticas</LayoutSlot>
			<div className="flex justify-end mb-4">
				<Button>Crear Practica</Button>
			</div>
			<div className="flex justify-center">
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{practices.map((practice) => (
						<CardPractice
							key={practice.id}
							title={practice.name}
							description={practice.description}
							numberOfGroups={practice.numberOfGroups}
							type={practice.type}
						/>
					))}
				</div>
			</div>
		</>
	);
}
