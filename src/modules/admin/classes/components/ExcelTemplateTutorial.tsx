import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"

import { FileDownloader } from "@/modules/shared/fileLoader/fileDownloaderButton"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
}


export default function ExceltutorialTemplate({ open, onClose }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] md:max-w-[700px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Cómo utilizar la plantilla </DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Con esta plantilla podrás subir todas las clases de forma masiva.
					<br />
					Solo debes asegurarte de llenar todos los campos que te indica el Excel y{" "}
					<strong>NO</strong> cambiar el nombre de las columnas de la primera fila.
				</DialogDescription>
				<DialogDescription>
					<strong>Campos pedidos en el excel</strong> <br />
					En el Excel encontrarás los siguientes campos:
					<ul className="ml-5 list-disc">
						<li>
							<strong>claseId</strong> Acá deberás ingresar el ID institucional de la clase
						</li>{" "}
						<br />
						<li>
							<strong>asignatura</strong> Acá deberás ingresar el ID institucional de la a
							asignatura a la que pertenece la clase
						</li>{" "}
						<br />
						<li>
							<strong>periodo</strong> Acá deberás ingresar el periodo al que pertenece la clase.
							Este es el año-periodo; por ejemplo; 2024-10 para el primer semestre de 2024, 2025-20
							para el perdiodo intersemestral de 2025 y 2026-30 para el segundo semestre de 2026.
						</li>{" "}
						<br />
						<li>
							<strong>participantes</strong> Acá deberás ingresar la cantidad de estudiantes de la
							clase
						</li>
						<br />
						<li>
							<strong>profesor 1</strong> Las últimas columnas dicen "profesor #". Si la clase solo
							tiene un profesor, se pone en la columna de profesor 1 el ID institucional del
							profesor y la otra se puede dejar vacía. Si la clase tiene tres profesores, entonces
							se deberá añadir una nueva columna "profesor 3" y añadir el id institucional de cada
							profesor
						</li>
					</ul>
				</DialogDescription>
				<DialogDescription>
					Acontinuación se muestra un ejemplo de cómo debería quedar el excel si se añaden dos
					clases:
					<br />
					<table className="mt-4 w-full border border-gray-300 text-sm">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-2 py-1">claseId</th>
								<th className="border border-gray-300 px-2 py-1">asignatura</th>
								<th className="border border-gray-300 px-2 py-1">periodo</th>
								<th className="border border-gray-300 px-2 py-1">participantes</th>
								<th className="border border-gray-300 px-2 py-1">profesor 1</th>
								<th className="border border-gray-300 px-2 py-1">profesor 2</th>
                                <th className="border border-gray-300 px-2 py-1">profesor 3</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-300 px-2 py-1">20001</td>
								<td className="border border-gray-300 px-2 py-1">10001</td>
								<td className="border border-gray-300 px-2 py-1">2025-10</td>
								<td className="border border-gray-300 px-2 py-1">30</td>
								<td className="border border-gray-300 px-2 py-1">1234</td>
                                <td className="border border-gray-300 px-2 py-1"></td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-2 py-1">20002</td>
								<td className="border border-gray-300 px-2 py-1">10002</td>
								<td className="border border-gray-300 px-2 py-1">2025-30</td>
								<td className="border border-gray-300 px-2 py-1">25</td>
								<td className="border border-gray-300 px-2 py-1">54321</td>
								<td className="border border-gray-300 px-2 py-1">81291</td>
                                <td className="border border-gray-300 px-2 py-1">6789</td>
							</tr>
						</tbody>
					</table>
                    <br />
                    <strong>NOTA: </strong>  recuerda que todos los ID institucionales de los profesores deben ser números de 11 dígitos.
                    <br />
				</DialogDescription>

				<DialogFooter>
					<FileDownloader fileName="classes" />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
