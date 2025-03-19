import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { CoursesDataTable } from "../components/CoursesDataTable"

export default function coursesPage() {
    return (
        <>
            <LayoutSlot name="title">Mis Asignaturas</LayoutSlot>
            <CoursesDataTable />
        </>
    )
}