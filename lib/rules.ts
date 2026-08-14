import type { Category, Movement, Rule } from "./types.ts";

export const DEFAULT_RULES: Rule[] = [
  { id: "r1", term: "mercadona|lidl|carrefour|charter|consum|rewe|aldi|alcampo|eroski|dia market|bonarea|hipercor|supermercado|supermercat|cooperativa|coop ", category: "Supermercado" },
  { id: "r2", term: "netflix|spotify|shopify|chatgpt|openai|hostinger|paypal|disney|hbo|max.com|prime video|apple.com/bill", category: "Suscripciones" },
  { id: "r3", term: "renfe|uber|cabify|taxi|cooltra|lime|emt|moto|parking|balearia|baleària|automat|repsol|plenergy|plenoil|cepsa|bp |gasolinera|estación de servicio|estacion de servicio", category: "Transporte" },
  { id: "r4", term: "consulting|nómina|nomina", category: "Nómina" },
  { id: "r5", term: "alquiler vivienda|alquiler piso|hipoteca|comunidad propietarios|electricidad|iberdrola|endesa|naturgy|agua", category: "Vivienda" },
  { id: "r6", term: "restaurante|cafetería|cafeteria|café |cafe |coffee|bar |cervecería|cerveceria|terra de mar|centro aragones|centro aragonés|glovo", category: "Restaurantes" },
  { id: "r7", term: "farmacia|clínica|clinica", category: "Salud" },
  { id: "r8", term: "seguro", category: "Seguros" },
  { id: "r9", term: "ahorro|aportación ahorro|aportacion ahorro", category: "Ahorro" },
  { id: "r10", term: "bizum cargo|bizum abono|bizum", category: "Bizum" },
  { id: "r11", term: "mol*corporate benef|corporate benef|adidas|nike|zara|mango|massimo dutti|leroy merlin|leory merlin|wallapop|sombrerería|sombrereria|primark|h&m|amazon|mediamarkt|media markt|ikea|el corte ingles|el corte inglés", category: "Compras" },
  { id: "r12", term: "pádel|padel|playtomic|pista deportiva|bicicleta|bici|gimnasio|gym|wellhub|gympass|crossfit|fitness|decathlon", category: "Deportes" },
  { id: "r13", term: "traspaso|transferencia", category: "Otras transferencias" },
  { id: "r14", term: "renta y patrimonio|agencia tributaria|aeat", category: "Impuestos y comisiones" },
  { id: "r15", term: "peluquería|peluqueria", category: "Peluquería" },
  { id: "r16", term: "centro aleman|centro alemán|academia|formación|formacion", category: "Educación" },
  { id: "r17", term: "enterticket|entradas|ticket|cine|teatro|concierto", category: "Ocio" },
];

const normalize = (value: string) => value
  .toLocaleLowerCase("es")
  .normalize("NFKD")
  .replace(/\p{M}/gu, "")
  .replace(/\s+/g, " ")
  .trim();

export function categorize(description: string, rules = DEFAULT_RULES): { category: Category; reason: string } {
  const value = normalize(description);
  const rule = rules.find((item) => item.term.split("|").some((term) => value.includes(normalize(term))));
  return rule ? { category: rule.category, reason: `Regla: contiene «${rule.term.replaceAll("|", "» o «")}»` } : { category: "Otros", reason: "Sin coincidencias; necesita revisión" };
}

export function applyRule(movements: Movement[], rule: Rule) {
  return movements.map((movement) => rule.term.split("|").some((term) => normalize(`${movement.concept ?? ""} ${movement.description}`).includes(normalize(term))) ? { ...movement, category: rule.category, reason: `Regla personalizada: «${rule.term}»`, status: "revisado" as const } : movement);
}

export function recategorizeUnreviewed(movements: Movement[], rules: Rule[]) {
  const effectiveRules = [...rules.filter((rule) => rule.custom), ...DEFAULT_RULES, ...rules.filter((rule) => !rule.custom)];
  return movements.map((movement) => {
    if (movement.reason === "Categoría corregida manualmente" && movement.category !== "Otros") return movement;
    const specificMatch = categorize(movement.description, DEFAULT_RULES);
    const match = specificMatch.category !== "Otros" ? specificMatch : categorize(`${movement.concept ?? ""} ${movement.description}`, effectiveRules);
    return { ...movement, category: match.category, reason: match.reason };
  });
}
