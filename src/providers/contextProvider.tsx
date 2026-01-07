'use client';

import React from 'react';
import ReduxProvider from './redux-provider';
import ReownProvider from './reownProvider';
import { MusicProvider } from './MusicProvider';
import MusicFloatingButton from '@/components/BackgroundMusic/MusicFloatingButton';

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      <ReownProvider>
        <ReduxProvider>
          {children}

          <MusicFloatingButton />
        </ReduxProvider>
      </ReownProvider>
    </MusicProvider>
  );
}

/*

'use client';

import React from 'react';
import ReduxProvider from './redux-provider';
import ReownProvider from './reownProvider';
import { MusicProvider } from './MusicProvider';

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      <ReownProvider>
        <ReduxProvider>{children}</ReduxProvider>
      </ReownProvider>
    </MusicProvider>
  );
}
*/
