import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

interface RecoveryPageProps {
  searchParams: URLSearchParams;
}

export default function RecoveryPage({ searchParams }: RecoveryPageProps) {
  const email = searchParams.get('email') || '';
  const isPasswordRecovery = searchParams.get('passwordRecovery') === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
        emailParam={email}
        isPasswordRecoveryParam={isPasswordRecovery}
      />
    </Suspense>
  );
}
