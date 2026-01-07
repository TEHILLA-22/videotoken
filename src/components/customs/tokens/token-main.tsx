'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const Tokens = dynamic(() => import('@/components/customs/tokens'), {
  ssr: false,
  loading: () => <p className="text-white text-center text-sm">Loading tokens...</p>,
});

export default function TokensList() {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab');
  const router = useRouter();

  useEffect(() => {
    if (!activeTab) {
      router.replace('?tab=new', { scroll: false });
    }
  }, [activeTab, router]);

  return (
    <Suspense fallback={<p className="text-white text-center text-sm">Loading tokens...</p>}>
      <section className="hidden xl:flex">
        <div className="mx-auto grid grid-cols-1 w-full xl:grid-cols-3 gap-3 xl:gap-4 px-2">
          <Tokens category="New" />
          <Tokens category="Trending" />
          <Tokens category="Titan of tokens" />
        </div>
      </section>

      <section className="xl:hidden">
        <div className="mx-auto grid grid-cols-1 max-w-full w-full xl:grid-cols-3 gap-3 xl:gap-6 sm:px-3 md:px-4 xl:px-6">
          {activeTab === 'new' && <Tokens category="New" />}
          {activeTab === 'trending' && <Tokens category="Trending" />}
          {activeTab === 'about-to-launch' && <Tokens category="Titan of tokens" />}
        </div>
      </section>
    </Suspense>
  );
}
