import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { RegistraSW } from "@/components/RegistraSW";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perguntas de Casal",
  description: "Um jogo de perguntas pra vocês dois se conhecerem melhor.",
  appleWebApp: { capable: true, title: "Nós Dois", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ff6b6b",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      // o script abaixo escreve data-tema antes da hidratação; sem isto o
      // React reclama de um mismatch que é justamente o comportamento certo
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Antes do primeiro paint: sem isto o app pisca claro antes de
            virar escuro, que é pior que não ter tema escuro nenhum. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=JSON.parse(localStorage.getItem("tema"));if(t)document.documentElement.dataset.tema=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full">
        {children}
        <RegistraSW />
      </body>
    </html>
  );
}
