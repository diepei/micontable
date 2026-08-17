import type { Movement } from "./types.ts";

export const valid = (m: Movement) => !m.cancelled && !m.ownTransfer;
export const expenses = (items: Movement[]) => items.filter((m) => valid(m) && m.amount < 0);
export const income = (items: Movement[]) => items.filter((m) => valid(m) && m.amount > 0);
export const sum = (items: Movement[]) => items.reduce((total, m) => total + Math.abs(m.amount), 0);

export function stats(items: Movement[], year: number) {
  const current = items.filter((m) => m.date.startsWith(String(year)));
  const previous = items.filter((m) => m.date.startsWith(String(year - 1)));
  const spend = sum(expenses(current)); const earned = sum(income(current)); const previousSpend = sum(expenses(previous));
  const saved = sum(expenses(current).filter((movement) => movement.category === "Ahorro"));
  const savingsRate = earned > 0 ? (saved / earned) * 100 : 0;
  const months = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
    const subset = current.filter((m) => m.date.startsWith(key));
    return { month: new Intl.DateTimeFormat("es", { month: "short" }).format(new Date(year, i, 1)).replace(".", ""), expenses: sum(expenses(subset)), income: sum(income(subset)) };
  });
  const grouped = (rows: Movement[], key: "category" | "merchant") => Object.entries(rows.reduce<Record<string, number>>((acc, m) => { acc[m[key]] = (acc[m[key]] || 0) + Math.abs(m.amount); return acc; }, {})).sort((a, b) => b[1] - a[1]);
  const category = grouped(expenses(current), "category"); const merchants = grouped(expenses(current), "merchant");
  const active = months.filter((m) => m.expenses > 0); const highest = [...active].sort((a, b) => b.expenses - a.expenses)[0]; const lowest = [...active].sort((a, b) => a.expenses - b.expenses)[0];
  return { spend, earned, saved, savingsRate, balance: earned - spend, average: active.length ? spend / active.length : 0, comparison: previousSpend ? ((spend - previousSpend) / previousSpend) * 100 : 0, months, category, merchants, highest, lowest, recurring: detectRecurring(current) };
}

export function detectRecurring(items: Movement[]) {
  const groups = items.filter((m) => m.amount < 0).reduce<Record<string, Movement[]>>((acc, m) => { (acc[m.merchant] ||= []).push(m); return acc; }, {});
  return Object.entries(groups).filter(([, rows]) => rows.length >= 3 && Math.max(...rows.map((r) => Math.abs(r.amount))) - Math.min(...rows.map((r) => Math.abs(r.amount))) < 3).map(([merchant, rows]) => ({ merchant, amount: Math.abs(rows[0].amount), frequency: "Mensual" }));
}

export function generateSummary(items: Movement[], year: number) {
  const s = stats(items, year); if (!s.spend) return "Todavía no hay gastos suficientes para generar el resumen de este año.";
  const top = s.category.slice(0, 3); const pct = (v: number) => `${((v / s.spend) * 100).toFixed(1).replace(".", ",")} %`;
  return `En ${year} se registraron ${money(s.spend)} en gastos y ${money(s.earned)} en ingresos. ${top.map(([name, value]) => `${name} representó ${pct(value)} (${money(value)})`).join("; ")}. ${s.highest ? `El mes con más gasto fue ${s.highest.month} (${money(s.highest.expenses)}) y el de menor gasto, ${s.lowest?.month} (${money(s.lowest?.expenses || 0)}).` : ""} ${s.merchants[0] ? `El comercio con mayor gasto acumulado fue ${s.merchants[0][0]} (${money(s.merchants[0][1])}).` : ""} Se detectaron ${s.recurring.length} pagos recurrentes. Frente al periodo anterior, el gasto ${s.comparison >= 0 ? "aumentó" : "disminuyó"} un ${Math.abs(s.comparison).toFixed(1).replace(".", ",")} %. Esta lectura se basa en los movimientos disponibles y no constituye asesoramiento financiero.`;
}

export const money = (value: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
