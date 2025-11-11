/**
 * App Providers
 * Root provider composition for the application
 */

import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DateRangeProvider, SpotifyDataProvider } from '@/shared/contexts';
import { FilterProvider } from '@/features/analytics/contexts';
import { BrandingProvider } from '@/features/sharing/contexts';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <DateRangeProvider>
        <FilterProvider>
          <SpotifyDataProvider>
            <BrandingProvider>{children}</BrandingProvider>
          </SpotifyDataProvider>
        </FilterProvider>
      </DateRangeProvider>
    </BrowserRouter>
  );
}
