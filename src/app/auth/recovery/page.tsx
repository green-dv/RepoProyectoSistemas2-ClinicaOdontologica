import { Suspense } from 'react';
import PasswordRecoveryComponent from '@/components/login/passwordRecovery';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function RecoveryPage({ searchParams }: Props) {
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
