import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/modules/core/components/ui/alert-dialog"

import { deleteUser } from "../services/userService"
import { toast } from "sonner"
import User from "@/modules/core/models/user"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	user?: User
}

export default function DeleteUserDialog({ open, onClose, user }: Props) {
	const handleConfirm = async () => {
		try {
			await deleteUser(user!.id as number)
			onClose(false)
			toast.success("Usuario eliminado exitosamente")
		} catch {
			toast.error("Error al eliminar el usuario")
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar el usuario?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán todos los datos vinculados a este usuario.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Eliminar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
};
