import { LogOut, Key } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/core/components/ui/avatar"
import { Button } from "@/modules/core/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu"
  
  export function UserNav() {
    return (
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
            <DropdownMenuItem>
              <Key />
              Cambiar Contraseña
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem>
            <LogOut />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }