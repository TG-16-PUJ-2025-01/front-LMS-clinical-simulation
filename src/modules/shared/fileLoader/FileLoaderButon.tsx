import { Sheet } from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import { useRef } from "react"
import { toast } from "sonner"
import { cn } from "@/modules/core/lib/utils"

interface FileLoaderProps {
	onFileLoaded: (file: ArrayBuffer) => void
	buttonText?: string
	className?: string
}

export function FileLoader({
	onFileLoaded,
	buttonText = "Cargar archivo",
	className,
}: FileLoaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileTypes = [
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"application/vnd.ms-excel",
			"text/csv",
		]

		const files = e.target.files

		if (files && files.length > 0) {
			const selectedFile = files[0]

			if (fileTypes.includes(selectedFile.type)) {
				e.target.value = "" // Limpiar el input

				const reader = new FileReader()
				reader.readAsArrayBuffer(selectedFile)
				reader.onload = (e) => {
					if (e.target?.result) {
						onFileLoaded(e.target.result as ArrayBuffer)
					}
				}
			} else {
				toast.error("Tipo de archivo no permitido")
			}
		}
	}

	return (
		<div>
			<Button
				className={cn("bg-green-800 hover:bg-green-800/90", className)}
				onClick={() => fileInputRef.current?.click()}
			>
				<Sheet className="mr-2 h-4 w-4 text-white" />
				{buttonText}
			</Button>
			<input type="file" ref={fileInputRef} onChange={handleFile} style={{ display: "none" }} />
		</div>
	)
}
