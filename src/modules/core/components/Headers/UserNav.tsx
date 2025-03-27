// components/UserNav.tsx
import { LogOut, Key } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback
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
import { getEmailByToken, getNameByToken } from "@/modules/shared/auth/services/authService";
import { useNavigate } from "react-router-dom";


export function UserNav() {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar el Dialog
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const navigate = useNavigate()

  function handleLogout(event: Event): void {
    event.preventDefault();
    clearToken();
    navigate("/login");
  }

  function getInitials(name: string): string {
    const [firstName, lastName] = name.split(" ");
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  useEffect(() => {
    const fetchEmailAndName = async () => {
      try {
        const email = await getEmailByToken();
        setEmail(email);
        const name = await getNameByToken();
        setName(name);
        setAvatar(getInitials(name));
      } catch (error) {
        console.error("Error al obtener el email:", error);
      }
    }
    fetchEmailAndName();
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 uppercase">
              <AvatarFallback>{avatar}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
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