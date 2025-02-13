import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import Room from "@/modules/core/models/room";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export async function getAllRooms(page: number, size: number) {
    const response = await axiosInstance.get(`/rooms/all`, {
        params: { page, size },
    });
    console.log("Dentro de getAllRooms");
    console.log(response.data);
    return response.data;
}

export async function getRoomById(id: number) {
    const response = await axiosInstance.get(`/rooms/${id}`);
    console.log("Dentro de getRoomById");
    console.log(response.data);
    return response.data;
}

export async function getRoomsTypes() {
    const response = await axiosInstance.get(`/rooms/types`);
    console.log("Dentro de getRoomsTypes");
    console.log(response.data);
    return response.data;
}

export async function updateRoom(room: Room) {
    const response = await axiosInstance.put(`/rooms/update`, room);
    console.log("Dentro de updateRoom");
    console.log(response.data);
    return response.data;
}

export async function deleteRoom(id: number) {
    const response = await axiosInstance.delete(`/rooms/delete/${id}`);
    console.log("Dentro de deleteRoom");
    console.log(response.data);
    return response.data;
}

