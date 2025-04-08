//infrastructure/repositories/TreatmentRepository.ts
import { Treatment, TreatmentDTO } from "@/domain/entities/Treatments";
import { ITreatmentRepository } from "@/domain/repositories/TreatmentRepository";

export class TreatmentRepository implements ITreatmentRepository {
    async fetchAll(query: string, showDisabled: boolean): Promise<Treatment[]> {
      const endpoint = showDisabled 
        ? `/api/treatments/disable?q=${query}` 
        : `/api/treatments?q=${query}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar tratamientos');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  
    async getById(id: number): Promise<Treatment> {
      const res = await fetch(`/api/treatments/${id}`);
      if (!res.ok) throw new Error('Error al cargar el tratamiento');
      return await res.json();
    }
  
    async create(treatment: TreatmentDTO): Promise<Treatment> {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatment),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar tratamiento');
      }
  
      return await response.json();
    }
  
    async update(id: number, treatment: TreatmentDTO): Promise<Treatment> {
      const response = await fetch(`/api/treatments/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(treatment),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar tratamiento');
      }
  
      return await response.json();
    }
  
    async delete(id: number): Promise<void> {
      const response = await fetch(`/api/treatments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el tratamiento');
    }
  
    async restore(id: number): Promise<void> {
      const response = await fetch(`/api/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });
  
      if (!response.ok) throw new Error('Error al restaurar el tratamiento');
    }
  
    async deletePermanently(id: number): Promise<void> {
      const response = await fetch(`/api/treatments/${id}?type=physical`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error al eliminar permanentemente el tratamiento');
    }
  }
  
  export const treatmentRepository = new TreatmentRepository();