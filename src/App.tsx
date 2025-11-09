import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider, BrandingProvider, ThemeProvider } from './contexts';

function App() {
  return (
    <>
      <PWAInstallPrompt />
      <BrowserRouter>
        <ThemeProvider>
          <DateRangeProvider>
            <FilterProvider>
              <SpotifyDataProvider>
                <BrandingProvider>
                  <AppRoutes />
                </BrandingProvider>
              </SpotifyDataProvider>
            </FilterProvider>
          </DateRangeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

