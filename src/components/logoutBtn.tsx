"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" }); 
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
};

export default LogoutButton;
