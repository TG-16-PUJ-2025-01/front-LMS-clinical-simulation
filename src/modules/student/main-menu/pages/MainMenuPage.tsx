import NavBar from "@/modules/core/components/Headers/NavBar";
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot";
import { MainMenuDataTable } from "../components/MainMenuDataTable";

export default function MainMenuPage(){
    return (
        <>
            <LayoutSlot name="header">
                <NavBar
                    navLinks={[
                        {
                            label: "Calendario",
                            href: "/estudiante/calendario",
                        },
                    ]}
                />
            </LayoutSlot>
            <LayoutSlot name="title">Tus Clases</LayoutSlot>
            <MainMenuDataTable />
        </>
    )
}