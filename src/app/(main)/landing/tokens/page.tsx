
import TokensList from '@/components/customs/tokens/token-main';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <TokensList />
    </Suspense>
  );
}
