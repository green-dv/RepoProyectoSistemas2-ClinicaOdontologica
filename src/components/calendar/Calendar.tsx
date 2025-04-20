"use client";
import { Calendar } from "@/components/calendar/BigCalendar";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import SnackbarAlert from "@/components/SnackbarAlert";
import DatesDialog from "@/components/dates/DatesDialog";
import useCalendar from "@/presentation/hooks/useCalendar";
import useCalendarHandler from "@/presentation/handlers/useCalendarHandler";
import { createPatientFetcher } from "@/presentation/handlers/patientsUtil";
import { Patient } from "@/domain/entities/Patient";

export function CalendarComponent({ initialDate }: { initialDate: string }) {
  const calendarState = useCalendar();
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const fetchPatients = useMemo(() => createPatientFetcher(setPatients), []);
  const{
      handleFetchDates,
      handleEdit,
      handleDelete,
      handleSubmit,
    } = useCalendarHandler(calendarState);
  const {
    events,
    currentDate,
    currentView,
    open,
    snackbar,
    newDate,
    selectedDate,
    setCurrentDate,
    setCurrentView,
    setOpen,
    setNewDate,
  } = calendarState;

  useEffect(() => {
    if (initialDate) {
      const parsedDate = new Date(initialDate);
      setCurrentDate(!isNaN(parsedDate.getTime()) ? parsedDate : new Date());
    } else {
      setCurrentDate(new Date());
    }
  }, [initialDate, setCurrentDate]);

  useEffect(() => {
    handleFetchDates(""); // Fetch dates when the component mounts
    return () => {
      if (handleFetchDates.cancel) {
        handleFetchDates.cancel(); // Cancel the debounced function on unmount
      }
    };
  }, [handleFetchDates]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      
    if (name === 'precio') {
      const numericValue = parseFloat(value) || 0;
      setNewDate(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setNewDate(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };

  const handleSelectSlot = (slotInfo: any) => {
    const start = moment(slotInfo.start);
    const end = moment(slotInfo.end);

    setNewDate({
      fecha: "",
      fechacita: start.format("YYYY-MM-DDTHH:mm"),
      duracionaprox:  1,
      idpaciente: null,
      idconsulta: 0,
      descripcion: "",
      idestadocita: 1,
    });
    setOpen(true);
  };

  const handleContextMenu = (event: React.MouseEvent, calendarEvent: any) => {
    event.preventDefault();
    console.log('Menu contextual para evento:', calendarEvent);
  };

  return (
    <div style={{ height: "100%", padding: "1rem" }}>
      <Calendar
        events={events}
        date={currentDate}
        onDelete={handleDelete}
        onSelectEvent={handleEdit}
        onContextMenu={handleContextMenu}
        onEdit={handleEdit}
        onUpdate={() => handleFetchDates}
        onNavigate={(date) => setCurrentDate(date)}
        defaultDate={new Date(initialDate)}
        onSelectSlot={handleSelectSlot}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        views={["month", "week", "day"]}
      />
      <DatesDialog
        patients={patients}
        fetchPatients={createPatientFetcher(setPatients)}
        open={open}
        onClose={() => setOpen(false)}
        date={newDate}
        handleChange={handleChange}
        isEditing={!!selectedDate}
        onSubmit={handleSubmit}
      />
      <SnackbarAlert snackbar={snackbar} onClose={() => {}} />
    </div>
  );
}

export default CalendarComponent;