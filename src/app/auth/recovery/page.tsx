'use client'; // 👈 Importante, si accedes a searchParams desde el navegador

import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

export default function RecoveryPage() {


  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
      />
    </Suspense>
  );
}
