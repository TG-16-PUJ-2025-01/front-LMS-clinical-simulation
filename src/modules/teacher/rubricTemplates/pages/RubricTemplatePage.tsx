import { RubricTemplateDataTable } from "@/modules/coordinator/rubricTemplates/components/RubricTemplateDataTable"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

export default function RubricTemplatePage() {
  return (
    <>
      <LayoutSlot name="title">Rúbricas</LayoutSlot>
      <RubricTemplateDataTable />
    </>
  )
}
