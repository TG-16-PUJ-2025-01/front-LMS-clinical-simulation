import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { RubricTemplateDataTable } from "../components/RubricTemplateDataTable"

export default function RubricTemplatePage() {
    return (
        <>
            <LayoutSlot name="title">Tus rúbricas</LayoutSlot>
            <RubricTemplateDataTable />
        </>
    )
}
