export interface RoomTypeDto {
    name: string;
}

export interface RoomDto {
    id?: number;
    name: string;
    type: RoomTypeDto;
}
