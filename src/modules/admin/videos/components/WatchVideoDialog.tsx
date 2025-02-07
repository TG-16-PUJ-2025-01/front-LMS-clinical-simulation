import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/modules/core/components/ui/dialog"

interface Props {
  open: boolean
  onClose: (open: boolean) => void
}

export default function WatchVideoDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Ver Video</DialogTitle>
					<DialogDescription>Estás viendo el video (nombre del video)</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
  )
}
