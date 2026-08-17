import type { Movement, Rule } from "./types.ts";
export interface DataStore { load(): Movement[] | null; save(items: Movement[]): void; clear(): void; export(rules: Rule[]): string; }
export class LocalDataStore implements DataStore {
  constructor(private key = "euroaeuro.movements") {}
  load() { if (typeof window === "undefined") return null; try { const parsed = JSON.parse(localStorage.getItem(this.key) || "null") as Movement[] | null; return parsed?.filter((movement) => movement.source !== "demo").map((movement) => { const legacy = movement.category as string; const category = legacy === "Transferencias" ? "Otras transferencias" as const : legacy === "Ingresos" ? "Otros" as const : legacy === "Formación" ? "Educación" as const : movement.category; return { ...movement, category }; }) || null; } catch { return null; } }
  save(items: Movement[]) { localStorage.setItem(this.key, JSON.stringify(items)); }
  clear() { localStorage.removeItem(this.key); localStorage.removeItem("euroaeuro.rules"); }
  export(rules: Rule[]) { return JSON.stringify({ exportedAt: new Date().toISOString(), movements: this.load() || [], rules }, null, 2); }
  loadRules(): Rule[] | null { try { const parsed = JSON.parse(localStorage.getItem("euroaeuro.rules") || "null") as Rule[] | null; return parsed?.map((rule) => { const legacy = rule.category as string; return { ...rule, category: legacy === "Ingresos" ? "Otros" as const : legacy === "Formación" ? "Educación" as const : rule.category }; }) || null; } catch { return null; } }
  saveRules(rules: Rule[]) { localStorage.setItem("euroaeuro.rules", JSON.stringify(rules)); }
}
