import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/roboto-mono";
import "./globals.css";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = { metadataBase: new URL(productionHost ? `https://${productionHost}` : "http://localhost:3000"), title: "MiContable · Tus finanzas, en equilibrio", description: "Tu balance financiero, claro, privado y sin complicaciones.", icons: { icon: "/favicon.svg" }, openGraph: { title: "MiContable", description: "Tus finanzas, en equilibrio.", images: ["/micontable-og.png"] }, twitter: { card: "summary_large_image", title: "MiContable", description: "Tus finanzas, en equilibrio.", images: ["/micontable-og.png"] } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="es"><body>{children}</body></html>; }
