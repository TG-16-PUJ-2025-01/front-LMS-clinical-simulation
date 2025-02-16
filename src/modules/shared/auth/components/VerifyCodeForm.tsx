// components/VerifyCodeForm.tsx
import { Label } from "@/modules/core/components/ui/label";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";

interface VerifyCodeFormProps {
    onSubmit: (code: string) => void;
}

export default function VerifyCodeForm({ onSubmit }: VerifyCodeFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("code") as string;
        onSubmit(code);
    };

    return (
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-center text-sm text-gray-600">
                        Ingresa el código que recibiste en tu correo electrónico.
                    </div>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="code" className="text-gray-700">Código de Verificación</Label>
                    <Input id="code" type="text" placeholder="123456" required />
                </div>
                <Button type="submit" className="w-full">Verificar</Button>
            </div>
        </form>
    );
}