import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import { CreateUserDTO } from "../dtos/createUserDTO";
import ApiResponse from "@/modules/core/models/apiResponse";
import User from "@/modules/core/models/user";

export async function getUsers(
    page: number,
    size: number,
    filter: string,
    sort: string,
    asc: boolean
): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/user/all`, {
        params: { page, size, filter, sort, asc },
    });
    return data;
}

export async function getUser(id: number): Promise<ApiResponse<User>> {
    const { data } = await axios.get(`${API_URL}/user/${id}`);
    return data;
}

export async function createUser(newUser: CreateUserDTO): Promise<ApiResponse<User>> {
    const { data } = await axios.post(`${API_URL}/user/add`, newUser);
    return data;
}

export async function updateUser(id: number, updatedUser: CreateUserDTO): Promise<ApiResponse<User>> {
    const { data } = await axios.put(`${API_URL}/user/update/${id}`, updatedUser);
    return data;
}

export async function deleteUser(id: number): Promise<ApiResponse<null>> {
    const { data } = await axios.delete(`${API_URL}/user/delete/${id}`);
    return data;
}

export async function getAllCoordinators(): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/user/all/coordinator`);
    return data;
}

export async function getAllProfessors(): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/user/all/professor`);
    return data;
}
