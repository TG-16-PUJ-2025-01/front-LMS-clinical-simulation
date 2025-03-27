// components/ui/RoleSelect.tsx
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/modules/core/components/ui/select"
import { useEffect, useState } from "react"

import { getRolesByToken } from "@/modules/shared/auth/services/authService"
import { usePreferencesStore } from "../../stores/preferencesStore"
import { useNavigate } from "react-router-dom"

interface RoleItem {
	value: string
	label: string
}

export default function RoleSelect() {
	const [roles, setRoles] = useState<RoleItem[]>([])
  const preferredRole = usePreferencesStore((state) => state.preferredRole)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const rolesFromBackend = await getRolesByToken() // Llama al servicio para obtener los roles
				const formattedRoles = rolesFromBackend.map((role) => ({
					value: role,
					label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
				}))
				setRoles(formattedRoles)

			} catch (error) {
				console.error("Error al obtener los roles:", error)
			}
		}

		fetchRoles()
	}, [])

	// Si solo hay un rol, no mostramos el Select
	if (roles.length === 1) {
		return null // O puedes mostrar solo el rol como texto si lo prefieres
	}

	return (
		<Select
			value={preferredRole}
			onValueChange={(role) => navigate(`/${role.toLowerCase()}`)}
		>
			<SelectTrigger className="mr-2 cursor-pointer">
				<SelectValue className="capitalize">
					{preferredRole
						? roles.find((role) => role.value === preferredRole)?.label
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
	)
}
