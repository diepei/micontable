import { readSheet } from "read-excel-file/browser";
import { parseCSV } from "./csv.ts";
import type { Movement } from "./types.ts";

type Cell = string | number | boolean | Date | null;
const text = (cell: Cell) => cell instanceof Date ? `${String(cell.getDate()).padStart(2, "0")}/${String(cell.getMonth() + 1).padStart(2, "0")}/${cell.getFullYear()}` : String(cell ?? "").replaceAll("\t", " ").replaceAll("\n", " ").trim();

export function findHeaderRow(rows: Cell[][]) {
  const index = rows.slice(0, 30).findIndex((row) => {
    const headers = row.map((cell) => text(cell).toLocaleLowerCase("es"));
    const hasDate = headers.some((h) => h.includes("fecha") || h.includes("f. operación") || h.includes("f. operacion"));
    const hasDescription = headers.some((h) => h.includes("concepto") || h.includes("descripción") || h.includes("descripcion"));
    const hasAmount = headers.some((h) => h.includes("importe") || h.includes("cargo") || h.includes("abono"));
    return hasDate && hasDescription && hasAmount;
  });
  if (index < 0) throw new Error("No encontramos la cabecera de movimientos en el Excel de Ibercaja.");
  return index;
}

export function parseWorkbookRows(rows: Cell[][], dateFormat = "DD/MM/YYYY", expensePositive = false): { rows: Movement[]; errors: number; headers: string[] } {
  const table = rows.slice(findHeaderRow(rows)).filter((row) => row.some((cell) => text(cell) !== ""));
  return parseCSV(table.map((row) => row.map(text).join("\t")).join("\n"), dateFormat, expensePositive);
}

export async function parseXLSX(file: File, dateFormat = "DD/MM/YYYY", expensePositive = false) {
  const rows = await readSheet(file, 1);
  return parseWorkbookRows(rows as unknown as Cell[][], dateFormat, expensePositive);
}
