// components/ChangePasswordDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import { changePassword } from "../services/authService";

import { toast } from "sonner";
import { validatePassword } from "@/modules/core/lib/utils";




interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ChangePasswordDialog({ isOpen, onOpenChange }: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      // Validar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      // Validar la contraseña con el regex
      if (!validatePassword(newPassword)) {
        setError(
          "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial."
        );
        return;
      }

      // Llamar al servicio para cambiar la contraseña
      await changePassword(password, newPassword);
      toast.success("Contraseña cambiada exitosamente");
      // Cerrar el Dialog después de cambiar la contraseña
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al cambiar la contraseña");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
            <div className="space-y-2">
            <label className="block text-sm font-medium">Actual Contraseña</label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu actual contraseña"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nueva Contraseña</label>
            <Input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirmar Contraseña</label>
            <Input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}