import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot";
import CalendarComponent from "@/modules/shared/calendar/components/GeneralCalendarComponent";

export default function CalendarPage(){
    return (
        <>
            <LayoutSlot name="title">Calendario General Salas</LayoutSlot>
            <div className="h-[75vh] overflow-y-auto min-h-[500px]">
                <CalendarComponent />
            </div>
        </>
    )
}