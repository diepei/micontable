import { categorize } from "./rules.ts";
import type { Movement } from "./types.ts";

const merchants = [
  ["Alquiler vivienda", "Alquiler", -920], ["Nómina Acme Studio", "Acme Studio", 2680],
  ["Mercadona Zaragoza", "Mercadona", -118.42], ["Spotify Premium", "Spotify", -10.99],
  ["Netflix.com", "Netflix", -17.99], ["Repsol E.S.", "Repsol", -64.8],
  ["Restaurante La Oliva", "La Oliva", -46.7], ["Farmacia Central", "Farmacia Central", -22.45],
  ["Uber trip", "Uber", -14.3], ["Carrefour Market", "Carrefour", -73.84],
  ["Seguro hogar", "Mapfre", -31.5], ["Glovo", "Glovo", -24.6],
] as const;

export function createDemoMovements(): Movement[] {
  const output: Movement[] = [];
  for (const year of [2025, 2026]) for (let month = 0; month < (year === 2026 ? 8 : 12); month++) {
    merchants.forEach(([description, merchant, base], index) => {
      if (index > 1 && (month + index) % 3 === 0) return;
      const amount = base < 0 ? Number((base * (1 + ((month + index) % 5) * 0.035)).toFixed(2)) : base + (month % 4 === 0 ? 80 : 0);
      const match = categorize(description);
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(2 + index).padStart(2, "0")}`;
      output.push({ id: `demo-${year}-${month}-${index}`, date, valueDate: date, concept: amount > 0 ? "ABONO" : "TARJETA VISA", reference: `8460${year}${String(month + 1).padStart(2, "0")}${String(index).padStart(4, "0")}`, description, merchant, category: match.category, account: index % 4 ? "Cuenta diaria · 4821" : "Visa · 1094", amount, currency: "EUR", status: index % 5 ? "revisado" : "pendiente", reason: match.reason, source: "demo" });
    });
  }
  return output;
}
