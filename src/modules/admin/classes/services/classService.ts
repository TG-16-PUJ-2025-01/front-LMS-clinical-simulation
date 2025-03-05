import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import { setToken } from "@/modules/core/lib/tokenHandler";
import ApiResponse from "@/modules/core/models/apiResponse";
import Class from "@/modules/core/models/class";
import User from "@/modules/core/models/user";
import CreateClassDTO from "../dtos/createClassDTO";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const getClasses = async (
  page: number,
  size: number,
  filter: string,
  sort: string,
  asc: boolean
): Promise<ApiResponse<Class[]>> => {
  try {
    const { data } = await axiosInstance.get("/class/all", {
      params: { page, size, filter, sort, asc },
    });
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    throw new Error("Error al obtener las clases");
  }
};

export const getClass = async (id: number): Promise<ApiResponse<Class>> => {
  try {
    const { data } = await axiosInstance.get("/class/get", { params: { id } });
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al obtener la clase:", error);
    throw new Error("Error al obtener la clase");
  }
};

export const createClass = async (newClass: CreateClassDTO): Promise<ApiResponse<Class>> => {
  try {
    const { data } = await axiosInstance.post("/class/add", newClass);
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al crear la clase:", error);
    throw new Error("Error al crear la clase");
  }
};

export const updateClass = async (id: number, updatedClass: CreateClassDTO): Promise<ApiResponse<Class>> => {
  try {
    const { data } = await axiosInstance.put(`/class/update/${id}`, updatedClass);
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al actualizar la clase:", error);
    throw new Error("Error al actualizar la clase");
  }
};

export const deleteClass = async (id: number): Promise<ApiResponse<Class>> => {
  try {
    const { data } = await axiosInstance.delete(`/class/delete/${id}`);
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al eliminar la clase:", error);
    throw new Error("Error al eliminar la clase");
  }
};

export const getAllProfessors = async (): Promise<ApiResponse<User[]>> => {
  try {
    const { data } = await axiosInstance.get(`/user/all/professor`);
    setToken(data.token); // Asigna el token
    return { ...data, data: data.data };
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    throw new Error("Error al obtener los profesores");
  }
};
