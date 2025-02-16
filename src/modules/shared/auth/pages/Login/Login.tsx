import { cn } from "@/modules/core/lib/utils";
import { Label } from "@/modules/core/components/ui/label";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex min-h-screen", className)} {...props}>
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <form className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
                  <img
                    src="/src/assets/logo-javeriana2.svg"
                    className="w-80 h-full"
                    alt="Logo Javeriana"
                  />
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-700">Usuario</Label>
                <Input id="email" type="email" placeholder="Usuario sin @javeriana.edu.co" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                <Input id="password" type="password" placeholder="Contraseña" required />
              </div>
              <Button type="submit" className="w-full">Ingresar</Button>
            </div>
            <div className="text-center text-sm text-gray-600">
              <a href="#" className="underline underline-offset-4">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </form>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
      <div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/src/assets/img-login.jpg')" }}></div>
    </div>
  );
}