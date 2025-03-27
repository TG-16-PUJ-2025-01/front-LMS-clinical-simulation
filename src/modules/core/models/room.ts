import RoomType from "./roomType";

export default interface Room {
    id: number;
    name: string;
    capacity: number;
    type: RoomType;
}