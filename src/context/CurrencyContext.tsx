import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { currencyService, LiveRatesState } from '../services/currencyService';
import { sound } from '../utils/audio';

interface CurrencyContextType {
  rates: LiveRatesState;
  isRefreshing: boolean;
  refreshRates: () => Promise<void>;
  marginPercent: number;
  setMarginPercent: (margin: number) => void;
  selectedDisplayRate: 'paralelo' | 'bcv' | 'euro';
  setSelectedDisplayRate: (mode: 'paralelo' | 'bcv' | 'euro') => void;
  toProtectedBs: (priceUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<LiveRatesState>(currencyService.getRates());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [marginPercent, setMarginPercent] = useState<number>(18);
  const [selectedDisplayRate, setSelectedDisplayRate] = useState<'paralelo' | 'bcv' | 'euro'>('paralelo');

  useEffect(() => {
    const unsubscribe = currencyService.subscribe((newRates) => {
      setRates(newRates);
    });

    // Auto-refresco de tasas cada 3 minutos
    const interval = setInterval(() => {
      currencyService.fetchLiveRates();
    }, 180000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const refreshRates = useCallback(async () => {
    setIsRefreshing(true);
    sound.playClick();
    try {
      await currencyService.fetchLiveRates();
      sound.playSuccess();
    } catch (e) {
      sound.playAlert();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const toProtectedBs = useCallback(
    (priceUsd: number) => {
      return currencyService.calculateProtectedBs(priceUsd, marginPercent);
    },
    [marginPercent, rates.paraleloUsd]
  );

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        isRefreshing,
        refreshRates,
        marginPercent,
        setMarginPercent,
        selectedDisplayRate,
        setSelectedDisplayRate,
        toProtectedBs,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
};
