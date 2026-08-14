import { createDemoMovements } from "./demo.ts";
import type { Movement } from "./types.ts";
export interface BankProvider { readonly id: string; readonly name: string; connect(): Promise<void>; sync(): Promise<Movement[]>; disconnect(): Promise<void>; }
export class IbercajaDemoProvider implements BankProvider {
  readonly id = "ibercaja-demo"; readonly name = "Ibercaja";
  async connect() { await new Promise((r) => setTimeout(r, 700)); }
  async sync(): Promise<Movement[]> { await new Promise((r) => setTimeout(r, 900)); return createDemoMovements().slice(-8).map((m) => ({ ...m, id: `psd2-${m.id}`, source: "psd2" as const })); }
  async disconnect() { await new Promise((r) => setTimeout(r, 300)); }
}
