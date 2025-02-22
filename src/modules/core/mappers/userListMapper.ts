import UserList from "../models/userList";

export function userListMapper(user): UserList {
    return {
        id: user.id,
        name: user.name,
    }
}