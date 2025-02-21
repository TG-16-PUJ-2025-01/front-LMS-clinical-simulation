import { Button } from "@/modules/core/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/dialog";
import { Input } from "@/modules/core/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/core/components/ui/form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "sonner";
import { createUser } from "../services/userService";

const animatedComponents = makeAnimated();

const roleOptions = [
    { value: "ESTUDIANTE", label: "Estudiante" },
    { value: "ADMIN", label: "Administrador" },
    { value: "PROFESOR", label: "Profesor" },
    { value: "COORDINADOR", label: "Coordinador" },
];

interface Props {
    open: boolean;
    onClose: (open: boolean) => void;
    onSuccess?: () => void;
}

const formSchema = z.object({
    id: z.coerce.number().int().positive({
        message: "El ID debe ser un número entero positivo",
    }),
    name: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres",
    }),
    lastName: z.string().min(2, {
        message: "El apellido debe tener al menos 2 caracteres",
    }),
    email: z.string().email({
        message: "Debe ser un email válido",
    }),
    roles: z.array(z.string()).min(1, {
        message: "Debe seleccionar al menos un rol",
    }),
});

export default function CreateUserDialog({ open, onClose, onSuccess }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            name: "",
            lastName: "",
            email: "",
            roles: [],
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [open, form]);

    const handleClose = () => {
        onClose(false);
        form.reset();
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createUser({
                institutionalId: values.id,
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                roles: values.roles,
            });
                onClose(false);
                toast.success("Usuario creado exitosamente");
                onSuccess?.(); // Notifica al componente padre que hubo éxito
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Error al crear el usuario");
        } finally {
            setIsSubmitting(false);
        }
    }
    
    

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Usuario</DialogTitle>
                    <DialogDescription>Para crear un usuario, llena los siguientes campos</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Form {...form}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">ID Institucional</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="id"
                                                placeholder="ID Institucional"
                                                className="col-span-3 m-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">Nombre</FormLabel>
                                        <FormControl>
                                            <Input id="name" placeholder="Nombre" className="col-span-3 m-0" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">Apellido</FormLabel>
                                        <FormControl>
                                            <Input id="lastName" placeholder="Apellido" className="col-span-3 m-0" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">Email</FormLabel>
                                        <FormControl>
                                            <Input id="email" placeholder="Email" className="col-span-3 m-0" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roles"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">Roles</FormLabel>
                                        <FormControl className="col-span-3">
                                            <Select
                                                components={animatedComponents}
                                                isMulti
                                                options={roleOptions}
                                                value={roleOptions.filter((r) => field.value.includes(r.value))}
                                                onChange={(selected) => field.onChange(selected.map((r) => r.value))}
                                                placeholder="Selecciona los roles..."
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creando..." : "Crear"}
                            </Button>
                        </DialogFooter>
                    </Form>
                </form>
            </DialogContent>
        </Dialog>
    );
}