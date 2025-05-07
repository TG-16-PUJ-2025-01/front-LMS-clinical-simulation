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
import makeAnimated from "react-select/animated"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/modules/core/components/ui/form"

import { useEffect, useState } from "react"
import { FileDownloader } from "@/modules/shared/fileLoader/fileDownloaderButton"

interface Props {
    open: boolean
    onClose: (open: boolean) => void
}

const animatedComponents = makeAnimated()

export default function ExceltutorialTemplate({ open, onClose }: Props) {


	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Cómo utilizar la plantilla </DialogTitle>
					<DialogDescription>njcnk</DialogDescription>
				</DialogHeader>
				
                <DialogFooter>
                    <FileDownloader fileName="classes" />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
