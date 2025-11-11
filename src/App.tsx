import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/router/AppRoutes';
import { PWAInstallPrompt } from '@/features/onboarding/components/PWAInstallPrompt';
import { SpotifyDataProvider, DateRangeProvider } from '@/shared/contexts';
import { FilterProvider } from '@/features/analytics/contexts';
import { BrandingProvider } from '@/features/sharing/contexts';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <PWAInstallPrompt />
      <BrowserRouter>
        <DateRangeProvider>
          <FilterProvider>
            <SpotifyDataProvider>
              <BrandingProvider>
                <AppRoutes />
              </BrandingProvider>
            </SpotifyDataProvider>
          </FilterProvider>
        </DateRangeProvider>
      </BrowserRouter>
      <Analytics />
    </>
  );
}

export default App;
