import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import { RoomDto } from "@/modules/admin/rooms/models/RoomDto";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export const roomService = {
    async getAllRooms(page: number = 0, size: number = 10) {
        const response = await axiosInstance.get(`/rooms/all`, {
            params: { page, size },
        });
        return response.data.data; // Asegúrate de devolver el objeto `data`
    },

    async getRoomById(id: number) {
        const response = await axiosInstance.get(`/rooms/${id}`);
        return response.data;
    },

    async addRoom(roomDto: RoomDto) {
        const response = await axiosInstance.post(`/rooms/add`, roomDto);
        return response.data;
    },

    async updateRoom(roomDto: RoomDto) {
        const response = await axiosInstance.put(`/rooms/update`, roomDto);
        return response.data;
    },

    async deleteRoomById(id: number) {
        const response = await axiosInstance.delete(`/rooms/delete/${id}`);
        return response.data;
    },
};

