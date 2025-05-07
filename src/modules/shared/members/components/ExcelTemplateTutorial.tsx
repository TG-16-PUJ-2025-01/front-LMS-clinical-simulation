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
					Con esta plantilla podrás subir a todos los miembros de la clase de forma masiva.
					<br />
					Solo debes asegurarte de llenar <strong>TODOS</strong> los campos que te indica el Excel y{" "}
					<strong>NO</strong> cambiar el nombre de las columnas de la primera fila.
				</DialogDescription>
				<DialogDescription>
					<strong>Campos pedidos en el excel</strong> <br />
					
                    En el Excel encontrarás los siguientes campos: 
                    <br />					<br />
					<ul className="ml-5 list-disc">
						<li>
							<strong>institutionalId</strong> Acá deberás ingresar el ID institucional del miembro.
							<strong>Este deberá tener 11 dígitos para que sea válido</strong>
						</li>{" "}
						<br />
						<li>
							<strong>profesor; estudiante</strong> Acá deberás seleccionar si el miembro es profesor o
                            estudiante. <strong>Recuerda que solo puedes seleccionar una opción</strong>.
						</li>{" "}
						<br />
					</ul>
				</DialogDescription>
				<DialogDescription>
					Acontinuación se muestra un ejemplo de cómo debería quedar el excel si se añaden dos
					miembros a la clase:
					<br />
					<table className="mt-4 w-full border border-gray-300 text-xs">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-2 py-1">institutionalId</th>
								<th className="border border-gray-300 px-2 py-1">profesor</th>
								<th className="border border-gray-300 px-2 py-1">estudiante</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-300 px-2 py-1">18391029123</td>
								<td className="border border-gray-300 px-2 py-1">x</td>
								<td className="border border-gray-300 px-2 py-1"></td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-2 py-1">81923492323</td>
								<td className="border border-gray-300 px-2 py-1"></td>
								<td className="border border-gray-300 px-2 py-1">x</td>
							</tr>
						</tbody>
					</table>
					<br />
				</DialogDescription>

				<DialogFooter>
                <FileDownloader fileName="class members" />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
