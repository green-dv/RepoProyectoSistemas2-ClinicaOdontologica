import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

export default function RecoveryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = typeof searchParams.email === 'string' ? searchParams.email : '';
  const isPasswordRecovery = searchParams.passwordRecovery === 'true';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryComponent
        emailParam={email}
        isPasswordRecoveryParam={isPasswordRecovery}
      />
    </Suspense>
  );
}
