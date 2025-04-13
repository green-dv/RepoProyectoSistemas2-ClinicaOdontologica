import {z} from 'zod';
export const patientSchemavalidation = z.object({
    nombres: z.string().min(2, {message: "El nombre es requerido y debe ser mayor a 2 caracteres"}),
    apellidos: z.string().min(2, {message: "El apellido es requerido y debe ser mayor a 2 caracteres"}),
    direccion: z.string().min(4, {message: "La direccion es requerida y debe ser mayor a 4 caracteres"}),
    telefonodomicilio: z.string().optional(),
    telefonopersonal: z.string().regex(/\d{7,14}/, "El telefono personal es requerido y debe tener entre 7 y 14 digitos"),
    lugarnacimiento: z.string().optional(),
    fechanacimiento: z.string().nullable().optional(),
    sexo: z.boolean().describe("Masculino o Femenino"),
    estadocivil: z.enum(["Soltero", "Casado", "Divorciado", "Viudo", "Unión Libre", "Separado", "Otro"]),
    ocupacion: z.string().min(2,"La ocupacion es requerida y debe ser mayor a 2 caracteres"),
    aseguradora: z.string().optional().nullable(),
});
