"use client";

import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
const TreatmentsButton = () => {
    const router = useRouter();
  const handleClik = async () => {
        router.push('/treatments')
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleClik}>
      Tratamientos
    </Button>
  );
};

export default TreatmentsButton;
