'use client';

import { Fragment, PropsWithChildren } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { MdErrorOutline } from 'react-icons/md';
import { PiConfettiLight } from 'react-icons/pi';

export default function ReduxProvider({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <NextTopLoader
        color="#7619BC"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl
        showSpinner={false}
        easing="ease"
        speed={200}
        zIndex={1600}
      />

      <Toaster
        richColors
        expand={false}
        visibleToasts={2}
        position="top-right"
        icons={{
          success: <PiConfettiLight size={29} className="pr-2" />,
          error: <MdErrorOutline size={29} className="pr-2" />,
        }}
      />

      {children}
    </Fragment>
  );
}
