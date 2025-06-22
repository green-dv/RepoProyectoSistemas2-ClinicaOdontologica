export interface ValidationRule<T> {
    validate: (value: T) => string | null;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export type PatientFieldKey = 
  'nombres' |
  'apellidos' |
  'telefonopersonal' |
  'telefonodomicilio' |
  'direccion' |
  'lugarnacimiento' |
  'fechanacimiento' |
  'estadocivil' |
  'ocupacion' |
  'aseguradora';



export class PatientValidationRules {


  // Reglas para nombres
    static readonly nombres: ValidationRule<string>[] = [
        {
        validate: (value: string) => !value?.trim() ? "Los nombres son requeridos" : null,
        message: "Los nombres son requeridos"
        },
        {
        validate: (value: string) => value?.trim().length < 2 ? "Los nombres deben tener al menos 2 caracteres" : null,
        message: "Los nombres deben tener al menos 2 caracteres"
        },
        {
        validate: (value: string) => value?.trim().length > 100 ? "Los nombres no pueden exceder 100 caracteres" : null,
        message: "Los nombres no pueden exceder 100 caracteres"
        },
        {
        validate: (value: string) => !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value?.trim() || '') ? "Los nombres solo pueden contener letras y espacios" : null,
        message: "Los nombres solo pueden contener letras y espacios"
        }
    ];

    // Reglas para apellidos
    static readonly apellidos: ValidationRule<string>[] = [
        {
        validate: (value: string) => !value?.trim() ? "Los apellidos son requeridos" : null,
        message: "Los apellidos son requeridos"
        },
        {
        validate: (value: string) => value?.trim().length < 2 ? "Los apellidos deben tener al menos 2 caracteres" : null,
        message: "Los apellidos deben tener al menos 2 caracteres"
        },
        {
        validate: (value: string) => value?.trim().length > 100 ? "Los apellidos no pueden exceder 100 caracteres" : null,
        message: "Los apellidos no pueden exceder 100 caracteres"
        },
        {
        validate: (value: string) => !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value?.trim() || '') ? "Los apellidos solo pueden contener letras y espacios" : null,
        message: "Los apellidos solo pueden contener letras y espacios"
        }
    ];

    // Reglas para teléfono personal
    static readonly telefonopersonal: ValidationRule<string>[] = [
        {
        validate: (value: string) => {
            if (!value?.trim()) return "El teléfono personal es requerido";
            return null;
        },
        message: "El teléfono personal es requerido"
        },
        {
        validate: (value: string) => {
            const cleanPhone = value?.replace(/\D/g, '') || '';
            return cleanPhone.length < 7 ? "El teléfono debe tener al menos 7 dígitos" : null;
        },
        message: "El teléfono debe tener al menos 7 dígitos"
        },
        {
        validate: (value: string) => {
            const cleanPhone = value?.replace(/\D/g, '') || '';
            return cleanPhone.length > 15 ? "El teléfono no puede exceder 15 dígitos" : null;
        },
        message: "El teléfono no puede exceder 15 dígitos"
        },
        {
        validate: (value: string) => {
            return !/^[\d\s\-\+\(\)]+$/.test(value?.trim() || '') ? "Formato de teléfono inválido" : null;
        },
        message: "Formato de teléfono inválido"
        }
    ];

    // Reglas para teléfono domicilio (opcional)
    static readonly telefonodomicilio: ValidationRule<string>[] = [
        {
        validate: (value: string) => {
            if (!value?.trim()) return null; // Es opcional
            const cleanPhone = value.replace(/\D/g, '');
            return cleanPhone.length < 7 ? "El teléfono debe tener al menos 7 dígitos" : null;
        },
        message: "El teléfono debe tener al menos 7 dígitos"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            const cleanPhone = value.replace(/\D/g, '');
            return cleanPhone.length > 15 ? "El teléfono no puede exceder 15 dígitos" : null;
        },
        message: "El teléfono no puede exceder 15 dígitos"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return !/^[\d\s\-\+\(\)]+$/.test(value.trim()) ? "Formato de teléfono inválido" : null;
        },
        message: "Formato de teléfono inválido"
        }
    ];

    // Reglas para dirección
    static readonly direccion: ValidationRule<string>[] = [
        {
        validate: (value: string) => !value?.trim() ? "La dirección es requerida" : null,
        message: "La dirección es requerida"
        },
        {
        validate: (value: string) => value?.trim().length < 5 ? "La dirección debe tener al menos 5 caracteres" : null,
        message: "La dirección debe tener al menos 5 caracteres"
        },
        {
        validate: (value: string) => value?.trim().length > 255 ? "La dirección no puede exceder 255 caracteres" : null,
        message: "La dirección no puede exceder 255 caracteres"
        }
    ];

    // Reglas para lugar de nacimiento
    static readonly lugarnacimiento: ValidationRule<string>[] = [
        {
        validate: (value: string) => {
            if (!value?.trim()) return null; // Es opcional
            return value.trim().length < 2 ? "El lugar de nacimiento debe tener al menos 2 caracteres" : null;
        },
        message: "El lugar de nacimiento debe tener al menos 2 caracteres"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return value.trim().length > 100 ? "El lugar de nacimiento no puede exceder 100 caracteres" : null;
        },
        message: "El lugar de nacimiento no puede exceder 100 caracteres"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,.-]+$/.test(value.trim()) ? "El lugar de nacimiento contiene caracteres inválidos" : null;
        },
        message: "El lugar de nacimiento contiene caracteres inválidos"
        }
    ];

    // Reglas para fecha de nacimiento
    static readonly fechanacimiento: ValidationRule<string>[] = [
        {
        validate: (value: string) => !value?.trim() ? "La fecha de nacimiento es requerida" : null,
        message: "La fecha de nacimiento es requerida"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            const date = new Date(value);
            return isNaN(date.getTime()) ? "Formato de fecha inválido" : null;
        },
        message: "Formato de fecha inválido"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            const date = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            return (age - 1) > 120 ? "La edad no puede ser mayor a 120 años" : null;
            }
            
            return age > 120 ? "La edad no puede ser mayor a 120 años" : null;
        },
        message: "La edad no puede ser mayor a 120 años"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            const date = new Date(value);
            const today = new Date();
            return date > today ? "La fecha de nacimiento no puede ser futura" : null;
        },
        message: "La fecha de nacimiento no puede ser futura"
        }
    ];

    // Reglas para estado civil
    static readonly estadocivil: ValidationRule<string>[] = [
        {
        validate: (value: string) => !value?.trim() ? "El estado civil es requerido" : null,
        message: "El estado civil es requerido"
        },
        {
        validate: (value: string) => {
            const validOptions = ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre'];
            return !validOptions.includes(value?.trim() || '') ? "Estado civil inválido" : null;
        },
        message: "Estado civil inválido"
        }
    ];

    // Reglas para ocupación
    static readonly ocupacion: ValidationRule<string>[] = [
        {
        validate: (value: string) => {
            if (!value?.trim()) return null; // Es opcional
            return value.trim().length < 2 ? "La ocupación debe tener al menos 2 caracteres" : null;
        },
        message: "La ocupación debe tener al menos 2 caracteres"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return value.trim().length > 100 ? "La ocupación no puede exceder 100 caracteres" : null;
        },
        message: "La ocupación no puede exceder 100 caracteres"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.-]+$/.test(value.trim()) ? "La ocupación contiene caracteres inválidos" : null;
        },
        message: "La ocupación contiene caracteres inválidos"
        }
    ];

    // Reglas para aseguradora
    static readonly aseguradora: ValidationRule<string>[] = [
        {
        validate: (value: string) => {
            if (!value?.trim()) return null; // Es opcional
            return value.trim().length < 2 ? "La aseguradora debe tener al menos 2 caracteres" : null;
        },
        message: "La aseguradora debe tener al menos 2 caracteres"
        },
        {
        validate: (value: string) => {
            if (!value?.trim()) return null;
            return value.trim().length > 100 ? "La aseguradora no puede exceder 100 caracteres" : null;
        },
        message: "La aseguradora no puede exceder 100 caracteres"
        }
    ];

    // Método para validar un campo específico
    static validateField(
        fieldName: PatientFieldKey,
        value: string
        ): string | null {
        const rules = this[fieldName] as ValidationRule<string>[];

        for (const rule of rules) {
            const error = rule.validate(value);
            if (error) {
            return error;
            }
        }

        return null;
        }


    // Método para obtener todas las reglas de validación
    static getAllFieldRules(): Record<PatientFieldKey, ValidationRule<string>[]> {
        return {
            nombres: this.nombres,
            apellidos: this.apellidos,
            telefonopersonal: this.telefonopersonal,
            telefonodomicilio: this.telefonodomicilio,
            direccion: this.direccion,
            lugarnacimiento: this.lugarnacimiento,
            fechanacimiento: this.fechanacimiento,
            estadocivil: this.estadocivil,
            ocupacion: this.ocupacion,
            aseguradora: this.aseguradora
        };
    }

    
}
