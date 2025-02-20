// userService.ts
import { User } from "@/modules/core/models/user";

export const createUser = async (user: Omit<User, "id">) => {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Error al crear el usuario");
    }

    return response.json();
};

export const updateUser = async (userId: number, userData: Omit<User, "id">) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
    }

    return response.json();
};

export const deleteUser = async (userId: number) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
    }
};