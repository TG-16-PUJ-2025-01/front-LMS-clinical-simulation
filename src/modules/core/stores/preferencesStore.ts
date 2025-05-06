import { create } from "zustand"

import Role from "../models/role"
import { setPreferredRole } from "@/modules/admin/users/services/userService"

interface PreferencesStore {
	preferredRole?: Role
}

interface PreferencesStoreActions {
	setPreferredRole: (role: Role) => Promise<void>
}

export const usePreferencesStore = create<PreferencesStore & PreferencesStoreActions>((set) => ({
	setPreferredRole: async (role) => {
		await setPreferredRole(role)
		set({ preferredRole: role })
	},
}))
