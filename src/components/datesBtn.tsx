"use client";

import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
const DatesButton = () => {
    const router = useRouter();
  const handleClik = async () => {
        router.push('/dates')
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleClik}>
      Citas
    </Button>
  );
};

export default DatesButton;
