/**
 * App Component
 * Root application component with providers and routing
 */

import { AppProviders } from './providers/AppProviders';
import AppRoutes from './router/AppRoutes';
import { PWAInstallPrompt } from '@/features/onboarding/components/PWAInstallPrompt';

export default function App() {
  return (
    <>
      <PWAInstallPrompt />
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </>
  );
}

