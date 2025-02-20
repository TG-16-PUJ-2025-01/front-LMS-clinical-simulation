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
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "sonner";

interface EditUserDialogProps {
    open: boolean;
    onClose: (open: boolean) => void;
    user: {
        id: number;
        name: string;
        lastName: string;
        email: string;
        institutionalId: string;
        roles: { value: string; label: string }[];
    };
}

const formSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Debe ser un email válido" }),
    institutionalId: z.string().min(1, { message: "El ID Institucional es requerido" }),
    roles: z.array(z.object({ value: z.string(), label: z.string() })).min(1, {
        message: "Debe seleccionar al menos un rol",
    }),
});

const roleOptions = [
    { value: "ESTUDIANTE", label: "Estudiante" },
    { value: "ADMIN", label: "Administrador" },
    { value: "PROFESOR", label: "Profesor" },
    { value: "INVITADO", label: "Invitado" },
];

const animatedComponents = makeAnimated();

export function EditUserDialog({ open, onClose, user }: EditUserDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: user,
    });

    useEffect(() => {
        form.reset(user);
    }, [user, form, open]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log("Usuario actualizado", values);
            toast.success("Usuario actualizado exitosamente");
            onClose(false);
        } catch (error) {
            toast.error("Error al actualizar el usuario");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Modifica los datos del usuario</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Form {...form}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="col-span-3 m-0" />
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
                                            <Input {...field} className="col-span-3 m-0" />
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
                                            <Input {...field} className="col-span-3 m-0" />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="institutionalId"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="m-0 text-right">ID Institucional</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="col-span-3 m-0" />
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
                                        <FormControl>
                                            <Select
                                                components={animatedComponents}
                                                isMulti
                                                options={roleOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="col-span-3 m-0"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 m-0 -mt-2 text-right" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </Form>
                </form>
            </DialogContent>
        </Dialog>
    );
}
