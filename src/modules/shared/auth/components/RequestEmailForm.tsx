// components/RequestEmailForm.tsx
import { Label } from "@/modules/core/components/ui/label";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";

interface RequestEmailFormProps {
    onSubmit: (email: string) => void;
}

export default function RequestEmailForm({ onSubmit }: RequestEmailFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        onSubmit(email);
    };

    return (
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2"> 
                    <div className="text-center text-sm text-gray-600"> 
                        Ingresa tu correo electrónico para recibir un código de verificación.
                    </div>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email" className="text-gray-700">Usuario</Label>
                    <Input id="email" type="text" placeholder="Usuario sin @javeriana.edu.co" required />
                </div>
                <Button type="submit" className="w-full">Enviar Código</Button>
            </div>
        </form>
    );
}