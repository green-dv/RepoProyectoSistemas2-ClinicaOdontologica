import { MedicalAttention, MedicalAttentionDTO } from "@/domain/entities/MedicalAttentions";
import { IMedicalAttentionRepository } from "@/domain/repositories/MedicalAttentionRepository";
export class MedicalAttentionRepository implements IMedicalAttentionRepository{
async fetchAll(query: string, showDisabled: boolean): Promise<MedicalAttention[]> {
      const endpoint = showDisabled 
        ? `/api/attentions/disable?q=${query}` 
        : `/api/attentions?q=${query}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar atenciones médicas');
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  
    async getById(id: number): Promise<MedicalAttention> {
      const res = await fetch(`/api/attentions/${id}`);
      if (!res.ok) throw new Error('Error al cargar la atención médica');
      return await res.json();
    }
  
    async create(medicalAttention: MedicalAttentionDTO): Promise<MedicalAttention> {
      const response = await fetch('/api/attentions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicalAttention),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar atención médica');
      }
  
      return await response.json();
    }
  
    async update(id: number, medicalAttention: MedicalAttentionDTO): Promise<MedicalAttention> {
      const response = await fetch(`/api/attentions/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(medicalAttention),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar atención médica');
      }
  
      return await response.json();
    }
  
    async delete(id: number): Promise<void> {
      const response = await fetch(`/api/attentions/${id}?type=logical`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la atención médica');
    }
  
    async restore(id: number): Promise<void> {
      const response = await fetch(`/api/attentions/${id}?type=restore`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });
  
      if (!response.ok) throw new Error('Error al restaurar la atención médica');
    }
  
    async deletePermanently(id: number): Promise<void> {
      const response = await fetch(`/api/attentions/${id}?type=physical`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error al eliminar permanentemente la atención médica');
    }
  }
  
  export const medicalAttentionRepository = new MedicalAttentionRepository();
