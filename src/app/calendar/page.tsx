'use client';
import CalendarComponent from "@/components/calendar/Calendar";
import { Suspense } from "react";

export default function CalendarPage() {
  

  return (
    <main>
      <Suspense fallback={<div>Cargando...</div>}>
          <CalendarComponent
          />
      </Suspense>
    </main>
  );
}