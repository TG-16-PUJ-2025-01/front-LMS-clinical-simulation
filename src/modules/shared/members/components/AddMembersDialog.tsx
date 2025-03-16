import { Button } from "@/modules/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { Input } from "@/modules/core/components/ui/input"
import { useEffect, useState } from "react"
import { Search, X, Sheet } from "lucide-react"
import { getStudentsNotInClass, updateClassMembers, getProfessorsNotInClass } from "../services/membersService"
import Role from "../../../core/models/role"
import { ScrollArea } from "@/modules/core/components/ui/scroll-area"
import { Separator } from "@/modules/core/components/ui/separator"
import { toast } from "sonner"

interface User {
	id: number
	email: string
	name: string
	lastName: string
	institutionalId: number
	roles: Role[]
	username: string
}

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classId: number,
	isStudent: boolean
}

export default function AddMembersDialog({ open, onClose, classId, isStudent }: Props) {
	const [filter, setFilter] = useState<string>("")
	const [students, setStudents] = useState<User[]>([])
	const [filteredStudents, setFilteredStudents] = useState<User[]>([])
	const [isSearchFocused, setIsSearchFocused] = useState(false)
	const [selectedStudents, setSelectedStudents] = useState<User[]>([])

	useEffect(() => {
		if(isStudent) 
		{
			const fetchNonMembers = async () => {
				const res = await getStudentsNotInClass(Number(classId), filter)
				setStudents(res.data) // Guardamos los estudiantes en el estado\
				setFilteredStudents(
					res.data.filter((student) =>
						`${student.name} ${student.lastName}`.toLowerCase().includes(filter.toLowerCase())
					)
				)
			}
			fetchNonMembers()

		}
		else
		{
			const fetchNonMembers = async () => {
				const res = await getProfessorsNotInClass(Number(classId), filter)
				setStudents(res.data) // Guardamos los estudiantes en el estado\
				console.log(res.data)
				setFilteredStudents(
					res.data.filter((student) =>
						`${student.name} ${student.lastName}`.toLowerCase().includes(filter.toLowerCase())
					)
				)
			}
			fetchNonMembers()
		}

	}, [filter, classId, open])

	const handleConfirm = async () => {
		//borrar el contenido de todas las listas
		setSelectedStudents([]) // Borra la lista de estudiantes seleccionados
		// Aquí podrías agregar lógica para añadir los estudiantes seleccionados
		selectedStudents

		try {
			await updateClassMembers(classId, selectedStudents)
			toast.success("Miembros anadidos a la clase correctamente")
		} catch (error) {
			toast.error("Error al anadir miembros en la clase")
		}
		onClose(false)
	}

	const handleSelectStudent = (student: User) => {
		// Evita agregar duplicados
		if (!selectedStudents.some((s) => s.id === student.id)) {
			setSelectedStudents([...selectedStudents, student])
		}

		setIsSearchFocused(false)
	}

	const handleRemoveStudent = (id: number) => {
		setSelectedStudents(selectedStudents.filter((s) => s.id !== id))
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Nuevos miembros</DialogTitle>
					<DialogDescription>Añade los nuevos miembros de la clase</DialogDescription>
				</DialogHeader>

				<div className="relative w-full max-w-sm">
					{/* Input de búsqueda */}
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar..."
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						onFocus={() => setIsSearchFocused(true)}
						onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
						className="w-full pl-8"
					/>

					{/* Lista de estudiantes disponibles flotante */}
					{isSearchFocused && (
						<div className="absolute top-full left-0 z-20 mt-2 w-full">
							<ScrollArea className="h-[320px] max-w-sm rounded-md border bg-white p-4 shadow-md">
								{filteredStudents.length > 0 ? (
									filteredStudents.map((student) => (
										<div key={student.id} onClick={() => handleSelectStudent(student)}>
											<div className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-4 shadow-md transition-colors hover:bg-gray-100">
												<div className="text-xs text-gray-900">
													<h3 className="font-semibold">
														{student.name} {student.lastName}
													</h3>
													<p className="text-gray-600">
														{student.roles.length > 0 ? student.roles[0].toLowerCase() : "Sin rol"}
													</p>
												</div>
											</div>
											<Separator className="my-2" />
										</div>
									))
								) : (
									<p className="text-center text-gray-500">No se encontraron resultados</p>
								)}
							</ScrollArea>
						</div>
					)}
				</div>

				{/* Contenedor para los estudiantes seleccionados */}
				<div className="relative mt-4 w-full max-w-sm">
					<ScrollArea className="h-[320px] w-full rounded-md">
						<h4 className="mb-4 text-sm leading-none font-medium">Seleccionados</h4>
						{selectedStudents.length > 0 ? (
							selectedStudents.map((student) => (
								<div
									key={student.id}
									className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-3 shadow-sm"
								>
									<div className="flex items-center gap-3">
										<div>
											<h3 className="text-sm font-semibold">
												{student.name} {student.lastName}
											</h3>
											<p className="text-xs text-gray-600">
												{student.roles.length > 0 ? student.roles[0] : "Sin rol"}
											</p>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveStudent(student.id)}
									>
										<X className="h-4 w-4 text-black" />
									</Button>
								</div>
							))
						) : (
							<p className="text-center text-gray-500"></p>
						)}
					</ScrollArea>
				</div>

				<DialogFooter>
					<Button onClick={() => onClose(false)}>Cancelar</Button>
					<Button onClick={handleConfirm}>Añadir</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
