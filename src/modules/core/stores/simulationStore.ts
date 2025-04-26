import { create } from "zustand"
import { toast } from "sonner";
import Simulation from "../models/simulation";
import { getSimulationById } from "@/modules/coordinator/simulations/services/simulationService";

interface SimulationStore {
  simulation?: Simulation
}

interface SimulationStoreActions {
  setSimulation: (simulationId: number) => Promise<void>
  unsetSimulation: () => void
}

export const useSimulationStore = create<SimulationStore & SimulationStoreActions>((set) => ({
  setSimulation: async (simulationId) => {
    try {
      const res = await getSimulationById(Number(simulationId))
      set({ simulation: res.data })
    } catch (error) {
      console.error(error)
      toast.error("No se encuentra la simulación")
    }
  },
  unsetSimulation: () => {
    set({ simulation: undefined })
  },
}))
