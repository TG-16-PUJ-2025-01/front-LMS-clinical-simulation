import { RoomsDataTable } from "../components/RoomsDataTable";
import { getAllRooms, getRoomById } from "../services/roomService";
import { Button } from "@/modules/core/components/ui/button";

export default function RoomsPage() {

  const fetchRooms = async () => {
    const res = await getAllRooms(0, 10);
    console.log("Rooms fetched!");
    console.log(res);
  };

  const fetchRoom = async () => {
    const res = await getRoomById(2);
    console.log("Room fetched!");
    console.log(res);
  }

  return (
    <main>
      <div>Rooms</div>
      <Button onClick={fetchRooms}>Cargar Salas</Button>
      <Button onClick={fetchRoom}>Cargar Sala</Button>
      <RoomsDataTable/>
    </main>
  );
}