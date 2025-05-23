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
			<DialogContent className="sm:max-w-[600px] md:max-w-[800px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Cómo utilizar la plantilla </DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Con esta plantilla podrás subir a todos los usuarios de forma masiva.
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
							<strong>idInstitucional</strong> Acá deberás ingresar el ID institucional del usuario.
							<strong>Este deberá tener 11 dígitos para que sea válido</strong>
						</li>{" "}
						<br />
						<li>
							<strong>nombre</strong> Acá deberás ingresar el nombre del usuario.
						</li>{" "}
						<br />
						<li>
							<strong>apellido</strong> Acá deberás ingresar el apellido del usuario.
						</li>{" "}
						<br />
						<li>
							<strong>email</strong> Acá deberás ingresar el correo del usuario.
						</li>
						<br />
						<li>
							<strong>administrador; profesor; estudiante; coordinador</strong> Son las ultimas
							columnas las cuales significan los roles que puede tener un usuario. Se deberá indicar
							con una X si el usuario tiene ese rol. Por ejemplo, si el usuario es profesor y
							estudiante, se deberá marcar en ambas columnas con una X.
						</li>
					</ul>
				</DialogDescription>
				<DialogDescription>
					Acontinuación se muestra un ejemplo de cómo debería quedar el excel si se añaden dos
					Usuarios:
					<br />
					<table className="mt-4 w-full border border-gray-300 text-xs">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-2 py-1">idInstitucional</th>
								<th className="border border-gray-300 px-2 py-1">nombre</th>
								<th className="border border-gray-300 px-2 py-1">apellido</th>
								<th className="border border-gray-300 px-2 py-1">email</th>
								<th className="border border-gray-300 px-2 py-1">administrador</th>
								<th className="border border-gray-300 px-2 py-1">profesor</th>
								<th className="border border-gray-300 px-2 py-1">estudiante</th>
								<th className="border border-gray-300 px-2 py-1">coordinador</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-300 px-2 py-1">18391029123</td>
								<td className="border border-gray-300 px-2 py-1">Pablo</td>
								<td className="border border-gray-300 px-2 py-1">Picasso</td>
								<td className="border border-gray-300 px-2 py-1">p.icasso@javeriana.edu.co</td>
								<td className="border border-gray-300 px-2 py-1"></td>
								<td className="border border-gray-300 px-2 py-1">x</td>
								<td className="border border-gray-300 px-2 py-1"></td>
								<td className="border border-gray-300 px-2 py-1">x</td>
							</tr>
							<tr>
								<td className="border border-gray-300 px-2 py-1">81923492323</td>
								<td className="border border-gray-300 px-2 py-1">Laura</td>
								<td className="border border-gray-300 px-2 py-1">Rojas</td>
								<td className="border border-gray-300 px-2 py-1">rojas_l@gmail.com</td>
								<td className="border border-gray-300 px-2 py-1"></td>
								<td className="border border-gray-300 px-2 py-1">x</td>
								<td className="border border-gray-300 px-2 py-1"></td>
								<td className="border border-gray-300 px-2 py-1"></td>
							</tr>
						</tbody>
					</table>
					<br />
				</DialogDescription>

				<DialogFooter>
					<FileDownloader fileName="users" />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
