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

interface Props {
  open: boolean
  onClose: (open: boolean) => void
}

export default function DeleteClassDialog({ open, onClose }: Props) {
	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán toda la información vinculada a dicha clase.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction>Eliminar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
