'use client';
import PasswordRecoveryComponent from "@/components/login/passwordRecovery";
import { Suspense } from 'react';

export default function RecoveryPage() {
  return (
   <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent />
    </Suspense>
  );
}