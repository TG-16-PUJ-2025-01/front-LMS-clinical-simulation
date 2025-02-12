import { useState } from "react";
import { RoomsDataTable } from "../components/RoomsDataTable";
import { roomService } from "../services/roomService";
import { Button } from "@/modules/core/components/ui/button";
import Room from "@/modules/core/models/room";

export default function RoomsPage() {

  const fetchRooms = async () => {
    const res = await roomService.getAllRooms(0, 10);
    console.log("Rooms fetched!");
    console.log(res);
  };

  const fetchRoom = async () => {
    const res = await roomService.getRoomById(1);
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