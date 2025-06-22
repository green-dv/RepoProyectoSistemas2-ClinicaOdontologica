import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

interface RecoveryPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function RecoveryPage({ searchParams }: RecoveryPageProps) {
  const email = typeof searchParams?.email === 'string' ? searchParams.email : '';
  const passwordRecovery = searchParams?.passwordRecovery === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
        emailParam={email}
        isPasswordRecoveryParam={passwordRecovery}
      />
    </Suspense>
  );
}