import { create } from "zustand"
import { toast } from "sonner";
import Practice from "../models/practice";
import { getPracticeById } from "@/modules/shared/practices/services/PracticeService";

interface PracticeStore {
  practice?: Practice
}

interface PracticeStoreActions {
  setPractice: (practiceId: number) => Promise<void>
  unsetPractice: () => void
  setPracticeData: (practice: Practice) => void
}

export const usePracticeStore = create<PracticeStore & PracticeStoreActions>((set) => ({
  setPractice: async (practiceId) => {
    try {
      const res = await getPracticeById(Number(practiceId))
      set({ practice: res.data })
    } catch (error) {
      console.error(error)
      toast.error("No se encuentra la práctica")
    }
  },
  unsetPractice: () => {
    set({ practice: undefined })
  },
  setPracticeData: (practice) => {
    set({ practice })
  }
}))
