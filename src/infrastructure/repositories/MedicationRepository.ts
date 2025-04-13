import { Medication, MedicationDTO } from "@/domain/entities/Medications";
import { IMedicationRepository } from "@/domain/repositories/MedicationRepository";

export class MedicationRepository implements IMedicationRepository{
async fetchAll(query: string, showDisabled: boolean): Promise<Medication[]> {
      const endpoint = showDisabled 
        ? `/api/medications/disable?q=${query}` 
        : `/api/medications?q=${query}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar medicaciones');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  
    async getById(id: number): Promise<Medication> {
      const res = await fetch(`/api/medications/${id}`);
      if (!res.ok) throw new Error('Error al cargar  la medicacion');
      return await res.json();
    }
  
    async create(medication: MedicationDTO): Promise<Medication> {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar medicaciones');
      }
  
      return await response.json();
    }
  
    async update(id: number, medication: MedicationDTO): Promise<Medication> {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(medication),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar medicacion');
      }
  
      return await response.json();
    }
  
    async delete(id: number): Promise<void> {
      const response = await fetch(`/api/medications/${id}?type=logical`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la medicacion');
    }
  
    async restore(id: number): Promise<void> {
      const response = await fetch(`/api/medications/${id}?type=restore`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });
  
      if (!response.ok) throw new Error('Error al restaurar la medicacion');
    }
  
    async deletePermanently(id: number): Promise<void> {
      const response = await fetch(`/api/medications/${id}?type=physical`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error al eliminar permanentemente la medicacion');
    }
  }
  
  export const medicationRepository = new MedicationRepository();
