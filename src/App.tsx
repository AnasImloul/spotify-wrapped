import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/router/AppRoutes';
import { PWAInstallPrompt } from '@/features/onboarding';
import { SpotifyDataProvider, DateRangeProvider } from '@/shared/contexts';
import { FilterProvider } from '@/features/analytics/contexts';
import { BrandingProvider } from '@/features/sharing/contexts';

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
    </>
  );
}

export default App;

