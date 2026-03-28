export interface UserData {
  nombre: string;
  email: string;
  empresa: string;
  cargo: string;
}

export interface BuyerPersona {
  id: string;
  nombreAvatar: string;
  edad: string;
  ubicacion: string;
  ocupacion: string;
  cita: string;
  metas: string;
  dolores: string;
  valores: string;
  miedos: string;
  redesSociales: string;
  keywords: string;
  formatoContenido: string;
  competencia: string;
  arquetipoRelacionado: string;
  isAI?: boolean;
  imageUrl?: string;
  aiAnalysis?: {
    descripcion: string;
    queEspera: string;
    pilaresContenido: string;
    ideasContenido: string;
    analisisCompetencia: string;
  };
}

export interface BrandArchetypeData {
  dominant: string;
  secondary: string;
  p1: string;
  p2: string;
  p3: string;
  sector: string;
  aiAnalysis?: {
    estrategiaComunicacion: string;
    tonoVoz: string;
    comportamientoDigital: string;
    culturaCorporativa: string;
    referenciaReal: string;
    links?: { title: string; uri: string }[];
  };
}

export interface BrandKeyData {
  fortaleza: string;
  competencia: string;
  target: string;
  insight: string;
  beneficios: string;
  valores: string;
  razones: string;
  discriminador: string;
  esencia: string;
  aiAnalysis?: {
    elementosRefinados: any;
    estrategiaEcosistema: any;
  };
}

export interface ValuePromiseData {
  customerJobs: string;
  pains: string;
  gains: string;
  painRelievers: string;
  gainCreators: string;
  synthesis: string;
  aiSuggestion?: string;
}

export interface MarketingPlanData {
  brandName: string;
  goals: string[];
  fullPlan?: any;
}
