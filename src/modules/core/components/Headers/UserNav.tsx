// components/UserNav.tsx
import { LogOut, Key } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/core/components/ui/avatar";
import { Button } from "@/modules/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";
import { ChangePasswordDialog } from "@/modules/shared/auth/components/ChangePasswordDialog";
import { clearToken } from "../../lib/tokenHandler";


export function UserNav() {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar el Dialog

  function handleLogout(event: Event): void {
    event.preventDefault();
    clearToken();
    window.location.href = "/login";
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Nombre</p>
              <p className="text-xs leading-none text-muted-foreground">
                correo@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
              <Key className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </DropdownMenuItem>
          </DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para cambiar contraseña */}
      <ChangePasswordDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}