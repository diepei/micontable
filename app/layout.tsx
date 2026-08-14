import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/roboto-mono";
import "./globals.css";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = { metadataBase: new URL(productionHost ? `https://${productionHost}` : "http://localhost:3000"), title: "EuroAEuro · Entiende dónde va cada euro", description: "Tu año financiero, claro y sin complicaciones.", icons: { icon: "/favicon.svg" }, openGraph: { title: "EuroAEuro", description: "Entiende dónde va cada euro.", images: ["/og.png"] }, twitter: { card: "summary_large_image", title: "EuroAEuro", description: "Entiende dónde va cada euro.", images: ["/og.png"] } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="es"><body>{children}</body></html>; }
