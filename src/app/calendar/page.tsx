'use client';
import CalendarComponent from "@/components/dates/Calendar";
import { useSearchParams } from 'next/navigation';

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date') || new Date().toISOString();

  return (
    <main>
      <CalendarComponent initialDate={dateParam} />
    </main>
  );
}