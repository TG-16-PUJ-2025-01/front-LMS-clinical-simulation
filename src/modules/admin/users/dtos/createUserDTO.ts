export interface CreateUserDTO {
    name: string;
    lastName: string;
    email: string;
    institutionalId: number;
    roles: string[];
}