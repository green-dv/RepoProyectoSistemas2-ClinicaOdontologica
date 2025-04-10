import {Date, DateDTO} from "@/domain/entities/Dates";
import {dateRepository} from "@/infrastructure/repositories/DateRepository";

export const fetchDates = async (query: string, showDisabled: boolean): Promise<Date[]> => {
    return await dateRepository.fetchAll(query, showDisabled);
}

export const createDate = async (date: DateDTO): Promise<Date> => {
    const trimmedDate = {
        fecha: date.fecha,
        idpaciente: date.idpaciente,
        idconsulta: date.idconsulta ?? null,
        descripcion: date.descripcion,
        idestadocita: 1,
        fechacita: date.fechacita,
        duracionaprox: date.duracionaprox ?? null
    }
    if(!trimmedDate.fecha) {
        throw new Error('La fecha es obligatoria')
    }
    if(!trimmedDate.idpaciente) {
        throw new Error('El paciente es obligatorio')
    }
    if(!trimmedDate.descripcion){
        throw new Error('La descripcion es obligatoria')
    }
    if(!trimmedDate.fechacita){
        throw new Error('La fecha de creacion es obligatoria')
    }
    if(!trimmedDate.idconsulta){
        trimmedDate.idconsulta = null;
    }
    return await dateRepository.create(trimmedDate);
}
export const updateDate = async (id: number, date: DateDTO): Promise<Date> => {
    let trimmedDate = {
        fecha: date.fecha.trim(),
        idpaciente: date.idpaciente,
        idconsulta: date.idconsulta,
        descripcion: date.descripcion.trim(),
        idestadocita: date.idestadocita,
        fechacita: date.fechacita.trim(),
        duracionaprox: date.duracionaprox
    }
    if(!trimmedDate.fecha) {
        throw new Error('La fecha es obligatoria')
    }
    if(!trimmedDate.idpaciente) {
        throw new Error('El paciente es obligatorio')
    }
    if(!trimmedDate.descripcion){
        throw new Error('La descripcion es obligatoria')
    }
    if(!trimmedDate.fechacita){
        throw new Error('La fecha de creacion es obligatoria')
    }
    
    return await dateRepository.update(id, trimmedDate);
}
export const updateDateStatus = async (idDate: number, idStatus: number): Promise<Date> =>{
    return await dateRepository.updateStatus(idDate, idStatus);
}

export const deleteDate = async (id: number): Promise<void> => {
    await dateRepository.delete(id);
}
export const restoreDate = async (id: number): Promise<void> => {
    await dateRepository.restore(id);
}
export const deleteDatePermanently = async (id: number): Promise<void> => {
    await dateRepository.deletePermanently(id);
}