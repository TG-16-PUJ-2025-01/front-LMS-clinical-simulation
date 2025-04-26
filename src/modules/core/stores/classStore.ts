import { create } from "zustand"
import Class from "../models/class";
import { getClass } from "@/modules/admin/classes/services/classService";
import { toast } from "sonner";

interface ClassStore {
	class?: Class
}

interface ClassStoreActions {
	setClass: (classId: number) => Promise<void>
	unsetClass: () => void
	setClassData: (classData: Class) => void
}

export const useClassStore = create<ClassStore & ClassStoreActions>((set) => ({
	setClass: async (classId) => {
		try {
			const res = await getClass(Number(classId))
			set({ class: res.data })
		} catch (error) {
			console.error(error)
			toast.error("No se encuentra la clase")
		}
	},
	unsetClass: () => {
		set({ class: undefined })
	},
	setClassData: (classData) => {
		set({ class: classData })
	}
}))
