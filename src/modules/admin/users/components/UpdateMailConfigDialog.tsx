import { Button } from "@/modules/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";
import { Input } from "@/modules/core/components/ui/input";
import { Label } from "@/modules/core/components/ui/label";
import { useState } from "react";
import { updateMailConfig } from "../services/mailConfigService";

interface UpdateMailConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UpdateMailConfigDialog({ open, onClose }: UpdateMailConfigDialogProps) {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      updateMailConfig(host, username, password);
      onClose();
    } catch (error) {
      console.error("Error al enviar la configuración del correo:", error);
      alert("Error al enviar la configuración del correo. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar configuración del correo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>SMTP Host</Label>
            <Input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="smtp.office365.com"
            />
          </div>
          <div>
            <Label>Correo electrónico</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario@javeriana.edu.co"
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}