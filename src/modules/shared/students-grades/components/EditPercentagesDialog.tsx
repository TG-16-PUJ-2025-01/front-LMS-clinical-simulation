'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/modules/core/components/ui/dialog"
import { Button } from '@/modules/core/components/ui/button'
import { Input } from '@/modules/core/components/ui/input'
import { Label } from '@/modules/core/components/ui/label'
import { getClassPractices, updatePracticePercentages } from '../services/gradeService'
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  classId: number
}

type PracticePercentage = {
  practiceId: number
  name: string
  percentage: number
}

export function EditPercentagesDialog({ open, onClose, classId }: Props) {
  const [practices, setPractices] = useState<PracticePercentage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getClassPractices(classId)
        .then((response) => {
          if (response.data) {
            const practicesData = response.data
              .filter((practice: any) => practice.gradeable)
              .map((practice: any) => ({
                practiceId: practice.id,
                name: practice.name,
                percentage: practice.gradePercentage ?? 0
              }))
            setPractices(practicesData)
          }
        })
        .catch((error) => {
          toast.error("No se pudieron cargar las prácticas")
          console.error("Error loading practices:", error)
        })
        .finally(() => setLoading(false))
    }
  }, [open, classId])
  

  const handleChange = (id: number, value: number) => {
    setPractices((prev) =>
      prev.map((p) => (p.practiceId === id ? { ...p, percentage: value } : p))
    )
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const payload = {
        practicesPercentages: practices.map(({ practiceId, percentage }) => ({
          practiceId,
          percentage
        }))
      }

      await updatePracticePercentages(payload)
      toast.success("Porcentajes actualizados correctamente")
      onClose()
    } catch (error) {
      toast.error("No se pudieron actualizar los porcentajes")
      console.error("Error updating percentages:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalPercentage = practices.reduce((sum, practice) => sum + practice.percentage, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Porcentajes de Prácticas</DialogTitle>
          <DialogDescription>
            Modifica el porcentaje de cada práctica. Asegúrate que el total sea 100%.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
          <>
            <div className="space-y-4">
              {practices.map((practice) => (
                <div key={practice.practiceId} className="grid grid-cols-2 items-center gap-4">
                  <Label>{practice.name}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={practice.percentage}
                    onChange={(e) => handleChange(practice.practiceId, parseFloat(e.target.value) || 0)}
                    placeholder={`${practice.percentage}%`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <p className={`text-sm ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total: {totalPercentage}%
              </p>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading || totalPercentage !== 100}
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}