import { createContext, useContext, useState, ReactNode } from 'react';

interface BrandingSettings {
  showWatermark: boolean;
  watermarkText: string;
  watermarkPosition: 'bottom-left' | 'bottom-right' | 'bottom-center';
}

interface BrandingContextType {
  settings: BrandingSettings;
  updateSettings: (settings: Partial<BrandingSettings>) => void;
}

const defaultSettings: BrandingSettings = {
  showWatermark: true,
  watermarkText: 'Made with Spotify Wrapped Analytics',
  watermarkPosition: 'bottom-center',
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BrandingSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<BrandingSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <BrandingContext.Provider value={{ settings, updateSettings }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
}

