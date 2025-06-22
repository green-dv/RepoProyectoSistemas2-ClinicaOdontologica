'use client'; // 👈 Importante, si accedes a searchParams desde el navegador

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

export default function RecoveryPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const isPasswordRecovery = searchParams.get('passwordRecovery') === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
      />
    </Suspense>
  );
}
