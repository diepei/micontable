export const CATEGORIES = ["Vivienda", "Supermercado", "Restaurantes", "Transporte", "Compras", "Salud", "Peluquería", "Deportes", "Ocio", "Viajes", "Educación", "Suscripciones", "Seguros", "Impuestos y comisiones", "Nómina", "Bizum", "Ahorro", "Otras transferencias", "Otros"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Movement = {
  id: string; date: string; description: string; merchant: string; category: Category;
  valueDate?: string; concept?: string; reference?: string;
  account: string; amount: number; currency: "EUR"; status: "revisado" | "pendiente";
  cancelled?: boolean; ownTransfer?: boolean;
  reason: string; source: "demo" | "csv" | "psd2";
};

export type Rule = { id: string; term: string; category: Category; custom?: boolean };
