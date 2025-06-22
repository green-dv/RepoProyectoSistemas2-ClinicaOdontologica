'use client';
import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function RecoveryPage({ searchParams }: PageProps) {
  const email = typeof searchParams?.email === 'string' ? searchParams.email : '';
  const isPasswordRecovery = searchParams?.passwordRecovery === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
        emailParam={email}
        isPasswordRecoveryParam={isPasswordRecovery}
      />
    </Suspense>
  );
}