import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, BuyerPersona, BrandArchetypeData, BrandKeyData, ValuePromiseData, MarketingPlanData } from '../types';

interface AppState {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  buyerPersonas: BuyerPersona[];
  setBuyerPersonas: React.Dispatch<React.SetStateAction<BuyerPersona[]>>;
  brandArchetype: BrandArchetypeData;
  setBrandArchetype: React.Dispatch<React.SetStateAction<BrandArchetypeData>>;
  brandKey: BrandKeyData;
  setBrandKey: React.Dispatch<React.SetStateAction<BrandKeyData>>;
  valuePromise: ValuePromiseData;
  setValuePromise: React.Dispatch<React.SetStateAction<ValuePromiseData>>;
  marketingPlan: MarketingPlanData;
  setMarketingPlan: React.Dispatch<React.SetStateAction<MarketingPlanData>>;
}

const defaultUserData: UserData = { nombre: '', email: '', empresa: '', cargo: '' };
const defaultArchetype: BrandArchetypeData = { dominant: '', secondary: '', p1: '', p2: '', p3: '', sector: '' };
const defaultBrandKey: BrandKeyData = { fortaleza: '', competencia: '', target: '', insight: '', beneficios: '', valores: '', razones: '', discriminador: '', esencia: '' };
const defaultValuePromise: ValuePromiseData = { customerJobs: '', pains: '', gains: '', painRelievers: '', gainCreators: '', synthesis: '' };
const defaultMarketingPlan: MarketingPlanData = { brandName: '', goals: [] };

const AppContext = createContext<AppState | undefined>(undefined);

// Helper to load data from localStorage
const loadInitialData = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(`simart_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(() => loadInitialData('userData', defaultUserData));
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>(() => loadInitialData('buyerPersonas', []));
  const [brandArchetype, setBrandArchetype] = useState<BrandArchetypeData>(() => loadInitialData('archetype', defaultArchetype));
  const [brandKey, setBrandKey] = useState<BrandKeyData>(() => loadInitialData('brandKey', defaultBrandKey));
  const [valuePromise, setValuePromise] = useState<ValuePromiseData>(() => loadInitialData('valuePromise', defaultValuePromise));
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlanData>(() => loadInitialData('marketingPlan', defaultMarketingPlan));

  // Save changes automatically to localStorage whenever the user works
  useEffect(() => {
    localStorage.setItem('simart_userData', JSON.stringify(userData));
    localStorage.setItem('simart_buyerPersonas', JSON.stringify(buyerPersonas));
    localStorage.setItem('simart_archetype', JSON.stringify(brandArchetype));
    localStorage.setItem('simart_brandKey', JSON.stringify(brandKey));
    localStorage.setItem('simart_valuePromise', JSON.stringify(valuePromise));
    localStorage.setItem('simart_marketingPlan', JSON.stringify(marketingPlan));
  }, [userData, buyerPersonas, brandArchetype, brandKey, valuePromise, marketingPlan]);

  return (
    <AppContext.Provider value={{
      userData, setUserData,
      buyerPersonas, setBuyerPersonas,
      brandArchetype, setBrandArchetype,
      brandKey, setBrandKey,
      valuePromise, setValuePromise,
      marketingPlan, setMarketingPlan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
