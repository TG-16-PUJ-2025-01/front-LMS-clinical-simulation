import { Download} from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import FileSaver from "file-saver"
import { toast } from "sonner"
import { ExcelFileClassMembers, ExcelFileUsers, ExcelFileClasses } from "@/modules/shared/fileConstants"

export function FileDownloader({ fileName }: { fileName: string }) {

	const handleDownload = () => {
		let dataBlob=""

        if (fileName === "classes") {
            dataBlob=ExcelFileClasses
        }
        else if (fileName === "class members") {
            dataBlob=ExcelFileClassMembers
        }
        else if(fileName === "users") {
            dataBlob=ExcelFileUsers
        }

        if(dataBlob === "") {
            toast.error("No se ha encontrado el archivo")
            return
        }

            let sliceSize = 1024;
            let byteCharacters = atob (dataBlob);
            let bytesLength = byteCharacters. length;
            let slicesCount = Math.ceil(bytesLength / sliceSize);
            let byteArrays = new Array(slicesCount);
            for (let sliceIndex= 0; sliceIndex < slicesCount; ++sliceIndex) {
                let begin = sliceIndex * sliceSize;
                let end = Math.min(begin + sliceSize, bytesLength);
                let bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset){
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
            
                byteArrays [sliceIndex] = new Uint8Array(bytes);
            }
            let blob = new Blob(byteArrays, { type: "application/vnd.ms-excel" });
            FileSaver.saveAs(new Blob([blob], { type: "application/vnd.ms-excel" }), `pantilla.xlsx`);
    }

	return (
		<div>
			<Button className="bg-green-800 hover:bg-green-800/90" onClick={handleDownload}>
				<Download className="h-4 w-4 text-white mr-2" />
                Descargar plantilla
			</Button>
		</div>
	)
}
