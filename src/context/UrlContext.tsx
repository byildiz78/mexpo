import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UrlContextType = {
  baseUrl: string;
  setBaseUrl: (url: string) => Promise<void>;
};

const defaultBaseUrl = 'https://robotpos.com';

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrlState] = useState<string>(defaultBaseUrl);

  React.useEffect(() => {
    // Load saved URL on startup
    AsyncStorage.getItem('baseUrl').then((savedUrl) => {
      if (savedUrl) {
        setBaseUrlState(savedUrl);
      }
    });
  }, []);

  const setBaseUrl = async (url: string) => {
    await AsyncStorage.setItem('baseUrl', url);
    setBaseUrlState(url);
  };

  return (
    <UrlContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrl() {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrl must be used within a UrlProvider');
  }
  return context;
}
