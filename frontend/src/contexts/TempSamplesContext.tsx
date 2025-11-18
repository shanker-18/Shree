import React, { createContext, useContext, useState, useEffect } from 'react';

interface SampleItem {
  id: string;
  product_name: string;
  category: string;
  quantity: number;
  price: number;
  isSample: boolean;
}

interface TempSamplesContextType {
  tempSamples: SampleItem[];
  addTempSamples: (samples: SampleItem[]) => void;
  clearTempSamples: () => void;
  hasTempSamples: () => boolean;
  getTempSamplesCount: () => number;
}

const TempSamplesContext = createContext<TempSamplesContextType | undefined>(undefined);

const TEMP_SAMPLES_KEY = 'temp_selected_samples';

export const TempSamplesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tempSamples, setTempSamples] = useState<SampleItem[]>([]);

  // Load temp samples from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEMP_SAMPLES_KEY);
      if (stored) {
        const parsedSamples = JSON.parse(stored);
        setTempSamples(parsedSamples);
        console.log('🆓 Loaded temp samples from storage:', parsedSamples);
      }
    } catch (error) {
      console.error('Error loading temp samples:', error);
    }
  }, []);

  const addTempSamples = (samples: SampleItem[]) => {
    console.log('🆓 Adding temp samples:', samples);
    setTempSamples(samples);
    try {
      localStorage.setItem(TEMP_SAMPLES_KEY, JSON.stringify(samples));
    } catch (error) {
      console.error('Error saving temp samples:', error);
    }
  };

  const clearTempSamples = () => {
    console.log('🧹 Clearing temp samples');
    setTempSamples([]);
    try {
      localStorage.removeItem(TEMP_SAMPLES_KEY);
    } catch (error) {
      console.error('Error clearing temp samples:', error);
    }
  };

  const hasTempSamples = () => {
    return tempSamples.length > 0;
  };

  const getTempSamplesCount = () => {
    return tempSamples.length;
  };

  const value: TempSamplesContextType = {
    tempSamples,
    addTempSamples,
    clearTempSamples,
    hasTempSamples,
    getTempSamplesCount
  };

  return (
    <TempSamplesContext.Provider value={value}>
      {children}
    </TempSamplesContext.Provider>
  );
};

export const useTempSamples = (): TempSamplesContextType => {
  const context = useContext(TempSamplesContext);
  if (!context) {
    throw new Error('useTempSamples must be used within a TempSamplesProvider');
  }
  return context;
};
