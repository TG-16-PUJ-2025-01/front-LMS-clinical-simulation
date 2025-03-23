import axios from "axios"
import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"
import Simulation from "@/modules/core/models/simulation"
import User from "@/modules/core/models/user"
import Practice from "@/modules/core/models/practice"

export async function getSimulationsByPracticeId(
	practiceId: number,
	page: number,
	size: number
): Promise<ApiResponse<Simulation[]>> {
	const { data } = await axios.get(`${API_URL}/simulation/practice/${practiceId}`, {
		params: {
			page,
			size,
		},
	})

	return data
}


interface SimulationRequest {
	practiceId: number;
	roomId: number;
	startDateTime: string;
	endDateTime: string;
}

interface CreateSimulationRequest {
	simulations: SimulationRequest[];
}

export async function createSimulations(simulations: CreateSimulationRequest) {
	try {
		const response = await axios.post(`${API_URL}/simulation`, simulations);
		return response.data;
	} catch (error) {
		console.error("Error al crear las simulaciones:", error);
		throw error;
	}
}

interface Room {
  id: number;
  name: string;
}

interface Reservation {
  startDateTime: string;
  endDateTime: string;
}

export async function getAllRooms(): Promise<Room[]> {
  try {
    const response = await axios.get(`${API_URL}/room/all`);
    return response.data.data.map((room: { id: number; name: string }) => ({
      id: room.id,
      name: room.name,
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

export async function getReservationsByRoom(roomId: string): Promise<Reservation[]> {
  if (!roomId) {
    console.warn("No se puede hacer la petición: sala o fecha no seleccionada");
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/simulation/room`, {
      params: { roomId },
    });

    return response.data.data.map((res: { startDateTime: string; endDateTime: string }) => ({
      startDateTime: res.startDateTime,
      endDateTime: res.endDateTime,
    }));
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
}


export async function getSimulationStudents(simulationId: number): Promise<ApiResponse<User[]>> {
	const { data } = await axios.get(`${API_URL}/simulation/${simulationId}/users`);
	return data;
}

export async function getPracticeById(practiceId: number): Promise<ApiResponse<Practice>> {
	const { data } = await axios.get(`${API_URL}/practice/${practiceId}`);
	return data;
}