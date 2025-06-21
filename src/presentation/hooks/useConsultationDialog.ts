import { useCallback, useEffect, useState } from "react";
import { Patient } from "@/domain/entities/Patient";
import { Treatment } from "@/domain/entities/Treatments";
import { fetchPatients, fetchTreatments } from "@/presentation/handlers/useConsultationDialog";

export const useCreateConsultation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [treatmentQuery, setTreatmentQuery] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);

  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingTreatments, setLoadingTreatments] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Buscar pacientes
  useEffect(() => {
    if (!debouncedSearchQuery.trim() || selectedPatient) {
      setPatients([]);
      return;
    }

    const searchPatients = async () => {
      try {
        setLoadingPatients(true);
        const data = await fetchPatients(debouncedSearchQuery);
        setPatients(data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };

    searchPatients();
  }, [debouncedSearchQuery, selectedPatient]);


  useEffect(() => {
    const loadInitialTreatments = async () => {
      try {
        setLoadingTreatments(true);
        const results = await fetchTreatments("", false);
        setTreatments(results || []);
      } catch (err) {
        console.error("Error loading initial treatments:", err);
        setTreatments([]);
      } finally {
        setLoadingTreatments(false);
      }
    };

    loadInitialTreatments();
  }, []);

  const handleTreatmentSearch = useCallback(async (query: string) => {
    setTreatmentQuery(query);
    
    if (!query.trim()) {
      try {
        setLoadingTreatments(true);
        const results = await fetchTreatments("", false);
        setTreatments(results || []);
      } catch (err) {
        console.error("Error loading treatments:", err);
        setTreatments([]);
      } finally {
        setLoadingTreatments(false);
      }
      return;
    }

    // Debounce para búsquedas con texto
    const timer = setTimeout(async () => {
      try {
        setLoadingTreatments(true);
        const results = await fetchTreatments(query, false);
        setTreatments(results || []);
      } catch (err) {
        console.error("Error searching treatments:", err);
        setTreatments([]);
      } finally {
        setLoadingTreatments(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const selectPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.nombres} ${patient.apellidos}`);
    setPatients([]); 
  }, []);

  const clearPatient = useCallback(() => {
    setSearchQuery("");
    setSelectedPatient(null);
    setPatients([]);
  }, []);

  const toggleTreatmentSelection = useCallback((treatment: Treatment) => {
    setSelectedTreatments(prev => {
      const exists = prev.some(t => t.idtratamiento === treatment.idtratamiento);
      if (exists) {
        return prev.filter(t => t.idtratamiento !== treatment.idtratamiento);
      }
      return [...prev, treatment];
    });
  }, []);

  // Función para limpiar todo el formulario
  const resetForm = useCallback(() => {
    setSearchQuery("");
    setSelectedPatient(null);
    setPatients([]);
    setTreatmentQuery("");
    setSelectedTreatments([]);

    handleTreatmentSearch("");
  }, [handleTreatmentSearch]);

  return {
    // Estados de pacientes
    searchQuery,
    setSearchQuery,
    patients,
    selectedPatient,
    selectPatient,
    clearPatient,
    loadingPatients,

    // Estados de tratamientos
    treatmentQuery,
    treatments,
    handleTreatmentSearch,
    selectedTreatments,
    setSelectedTreatments, 
    toggleTreatmentSelection,
    loadingTreatments,

    resetForm,
  };
};