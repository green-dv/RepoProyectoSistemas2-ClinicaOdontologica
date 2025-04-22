'use client';
import { Date as DatesObj } from "@/domain/entities/Dates";
import React from "react";
import { Chart } from "react-google-charts";

export default function NumberDatesPerStatusChart({ dates }: { dates: DatesObj[] }) {
  const data = [
    ['Estado', 'Cantidad'],
    ['Pendiente', dates.filter((date) => date.idestado === 1).length],
    ['Completado', dates.filter((date) => date.idestado === 2).length],
    ['Cancelado', dates.filter((date) => date.idestado === 3).length],
    ['No asistió', dates.filter((date) => date.idestado === 5).length],
  ];

  const options = {
    chart: {
      title: "Citas por Estado",
      subtitle: "Cantidad de citas por estado",
    },
    bar: { groupWidth: '10px' },
  };

  return (
    <Chart
      chartType="Bar"
      width="70%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
