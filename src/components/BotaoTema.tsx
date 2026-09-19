"use client";

import { useTema } from "@/lib/tema";

export function BotaoTema() {
  const { tema, alternar, pronto } = useTema();
  if (!pronto) return null;

  const escuro = tema === "escuro";
  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={escuro}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="min-h-11 min-w-11 rounded-full bg-white/20 text-lg ring-1 ring-white/35 backdrop-blur transition hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span aria-hidden>{escuro ? "☀️" : "🌙"}</span>
    </button>
  );
}
