// components/NewPasswordForm.tsx
import { Label } from "@/modules/core/components/ui/label";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";

interface NewPasswordFormProps {
    onSubmit: (newPassword: string) => void;
}

export default function NewPasswordForm({ onSubmit }: NewPasswordFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("newPassword") as string;
        onSubmit(newPassword);
    };

    return (
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-center text-sm text-gray-600">
                        Ingresa tu nueva contraseña.
                    </div>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="newPassword" className="text-gray-700">Nueva Contraseña</Label>
                    <Input id="newPassword" type="password" placeholder="Nueva contraseña" required />
                </div>
                <Button type="submit" className="w-full">Guardar</Button>

            </div>
        </form>
        
    );
}