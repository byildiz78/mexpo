import React, { createContext, useContext, useState } from 'react';

export type Theme = {
  name: string;
  primary: string;
  secondary: string;
  headerGradient: string[];
  footerGradient: string[];
  text: string;
  background: string;
  textDark: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  border: string;
  shadowColor: string;
  cardBackground: string;
  inputBackground: string;
  placeholder: string;
  disabled: string;
  divider: string;
};

export const themes = {
  blue: {
    name: 'Mavi',
    primary: '#2563eb',
    secondary: '#3b82f6',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#ffffff',
    textDark: '#1e293b',
    headerGradient: ['#2563eb', '#3b82f6'],
    footerGradient: ['#2563eb', '#3b82f6'],
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#0ea5e9',
    border: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    placeholder: '#94a3b8',
    disabled: '#cbd5e1',
    divider: '#e2e8f0',
  },
  dark: {
    name: 'Koyu',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#ffffff',
    textDark: '#f8fafc',
    headerGradient: ['#1e293b', '#334155'],
    footerGradient: ['#1e293b', '#334155'],
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#0ea5e9',
    border: '#334155',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    cardBackground: '#1e293b',
    inputBackground: '#334155',
    placeholder: '#64748b',
    disabled: '#475569',
    divider: '#334155',
  },
  purple: {
    name: 'Mor',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#ffffff',
    textDark: '#1e293b',
    headerGradient: ['#8b5cf6', '#a78bfa'],
    footerGradient: ['#8b5cf6', '#a78bfa'],
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#0ea5e9',
    border: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    placeholder: '#94a3b8',
    disabled: '#cbd5e1',
    divider: '#e2e8f0',
  },
  green: {
    name: 'Yeşil',
    primary: '#22c55e',
    secondary: '#4ade80',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#ffffff',
    textDark: '#1e293b',
    headerGradient: ['#22c55e', '#4ade80'],
    footerGradient: ['#22c55e', '#4ade80'],
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#0ea5e9',
    border: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    placeholder: '#94a3b8',
    disabled: '#cbd5e1',
    divider: '#e2e8f0',
  },
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(themes.blue);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
