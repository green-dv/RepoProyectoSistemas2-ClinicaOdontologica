'use client';

import PasswordRecoveryComponent from '@/components/login/passwordRecovery';
import { Suspense } from 'react';

export default function RecoveryPage({ searchParams }: { searchParams: Record<string, string> }) {
  const email = searchParams.email || '';
  const passwordRecovery = searchParams.passwordRecovery === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
        emailParam={email}
        isPasswordRecoveryParam={passwordRecovery}
      />
    </Suspense>
  );
}