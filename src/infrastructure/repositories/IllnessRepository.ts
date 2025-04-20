import { Illness, IllnessDTO } from "@/domain/entities/Illnesses";
import { IIllnessRepository } from "@/domain/repositories/IllnessRepository";

export class IllnessRepository implements IIllnessRepository{
async fetchAll(query: string, showDisabled: boolean): Promise<Illness[]> {
      const endpoint = showDisabled 
        ? `/api/illnesses/disable?q=${query}` 
        : `/api/illnesses?q=${query}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar enfermedades');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  
    async getById(id: number): Promise<Illness> {
      const res = await fetch(`/api/illnesses/${id}`);
      if (!res.ok) throw new Error('Error al cargar  la enfermedad');
      return await res.json();
    }
  
    async create(illness: IllnessDTO): Promise<Illness> {
      const response = await fetch('/api/illnesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(illness),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar enfermedades');
      }
  
      return await response.json();
    }
  
    async update(id: number, illness: IllnessDTO): Promise<Illness> {
      const response = await fetch(`/api/illnesses/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(illness),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar enfermedad');
      }
  
      return await response.json();
    }
  
    async delete(id: number): Promise<void> {
      const response = await fetch(`/api/illnesses/${id}?type=logical`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la enfermedad');
    }
  
    async restore(id: number): Promise<void> {
      const response = await fetch(`/api/illnesses/${id}?type=restore`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });
  
      if (!response.ok) throw new Error('Error al restaurar la enfermedad');
    }
  
    async deletePermanently(id: number): Promise<void> {
      const response = await fetch(`/api/illnesses/${id}?type=physical`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error al eliminar permanentemente la enfermedad');
    }
  }
  
  export const illnessRepository = new IllnessRepository();
