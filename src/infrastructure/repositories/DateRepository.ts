import {Date, DateDTO} from "@/domain/entities/Dates";
import {IDatesRepository} from "@/domain/repositories/DateRepository";

export class DateRepository implements IDatesRepository {
    async fetchAll(query: string, showDisabled: boolean): Promise<Date[]> {
        const endpoint = showDisabled 
            ? `/api/dates/disable?q=${query}` 
            : `/api/dates?q=${query}`;
        
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Error al cargar citas');
        
        const data = await res.json();
        /*console.log('Fetching data from repository');
        console.log(data)
        console.log(Array.isArray(data))*/
        return Array.isArray(data) ? data : [];
    }
    async getById(id: number): Promise<Date> {
        const res = await fetch(`/api/dates/${id}`);
        if (!res.ok) throw new Error('Error al cargar la fecha');
        return await res.json();
    }
    async create(date: DateDTO): Promise<Date> {
        const response = await fetch('/api/dates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(date),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al agregar cita');
        }

        return await response.json();
    }
    async update(id: number, date: DateDTO): Promise<Date> {
        const response = await fetch(`/api/dates/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(date),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar fecha');
        }

        return await response.json();
    }
    async delete(id: number): Promise<void> {
        const response = await fetch(`/api/dates/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la fecha');
    }
    async restore(id: number): Promise<void> {
        const response = await fetch(`/api/dates/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ disabled: false }),
        });
        if (!response.ok) throw new Error('Error al restaurar la fecha');
    }
    async deletePermanently(id: number): Promise<void> {
        const response = await fetch(`/api/dates/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ type: 'permanent' }),
        });
        if (!response.ok) throw new Error('Error al eliminar la fecha permanentemente');
    }
}
export const dateRepository = new DateRepository();
