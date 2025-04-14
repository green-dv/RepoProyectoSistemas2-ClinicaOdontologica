import {z} from 'zod';
export const patientSchemavalidation = z.object({
    monto: z.number().min(0, { message: "No se aceptan valores negativos" }).max(10000, { message: "this👏is👏too👏big" }),
    fecha: z.string().datetime(),
    enlacedetalle: z.string().min(10, {message: "El enlace detalle es requerido y debe ser mayor a 10 caracteres"}),
    idconsulta: z.number()
});