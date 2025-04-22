import { Habit, HabitDTO } from "@/domain/entities/Habits";
import { IHabitRepository } from "@/domain/repositories/HabitRepository";

export class HabitRepository implements IHabitRepository{
async fetchAll(query: string, showDisabled: boolean): Promise<Habit[]> {
      const endpoint = showDisabled 
        ? `/api/habits/disable?q=${query}` 
        : `/api/habits?q=${query}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar habitos');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  
    async getById(id: number): Promise<Habit> {
      const res = await fetch(`/api/habits/${id}`);
      if (!res.ok) throw new Error('Error al cargar el habito');
      return await res.json();
    }
  
    async create(habit: HabitDTO): Promise<Habit> {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar habitos');
      }
  
      return await response.json();
    }
  
    async update(id: number, habit: HabitDTO): Promise<Habit> {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(habit),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar habito');
      }
  
      return await response.json();
    }
  
    async delete(id: number): Promise<void> {
      const response = await fetch(`/api/habits/${id}?type=logical`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el habit');
    }
  
    async restore(id: number): Promise<void> {
      const response = await fetch(`/api/habits/${id}?type=restore`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });
  
      if (!response.ok) throw new Error('Error al restaurar el habit');
    }
  
    async deletePermanently(id: number): Promise<void> {
      const response = await fetch(`/api/habits/${id}?type=physical`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error al eliminar permanentemente el habit');
    }
  }
  
  export const habitRepository = new HabitRepository();