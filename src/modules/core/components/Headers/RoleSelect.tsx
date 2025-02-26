// components/ui/RoleSelect.tsx
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/modules/core/components/ui/select";
  import { useEffect, useState } from "react";

import { getRolesByToken } from "@/modules/shared/auth/services/authService";
  
  interface Role {
    value: string;
    label: string;
  }
  
  export default function RoleSelect() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
  
    useEffect(() => {
      const fetchRoles = async () => {
        try {
            const rolesFromBackend = await getRolesByToken(); // Llama al servicio para obtener los roles
            const formattedRoles = rolesFromBackend.map((role) => ({
                value: role.toLowerCase(),
                label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
            }));
            setRoles(formattedRoles);

            if (formattedRoles.length > 0) {
                setSelectedRole(formattedRoles[0].value);
              }

        } catch (error) {
          console.error("Error al obtener los roles:", error);
        }
      };
  
      fetchRoles();
    }, []);

    // Si solo hay un rol, no mostramos el Select
    if (roles.length === 1) {
        return null; // O puedes mostrar solo el rol como texto si lo prefieres
    }
  
    return (
        <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="mr-2 cursor-pointer">
          <SelectValue>
            {selectedRole
              ? roles.find((role) => role.value === selectedRole)?.label
              : "Selecciona un rol"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rol</SelectLabel>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }