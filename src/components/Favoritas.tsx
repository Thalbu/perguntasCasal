"use client";

import { useState } from "react";
import { useFavoritas } from "@/lib/favoritas";

export function Favoritas() {
  const { favoritas, alternar, limpar, pronto } = useFavoritas();
  const [aberto, setAberto] = useState(false);

  if (!pronto || favoritas.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <div className="flex items-baseline justify-between">
        <button
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="min-h-11 text-sm font-semibold text-white"
        >
          ♥ Guardadas ({favoritas.length}) {aberto ? "▴" : "▾"}
        </button>
        {aberto && (
          <button
            onClick={limpar}
            className="inline-flex min-h-11 items-center px-2 text-xs text-white/70 underline underline-offset-2 hover:text-white"
          >
            limpar
          </button>
        )}
      </div>

      {aberto && (
        <ul className="mt-2 flex flex-col gap-2">
          {favoritas.map((f) => (
            <li key={f.id} className="flex items-start gap-2 text-sm text-white/90">
              <span className="flex-1">{f.texto}</span>
              <button
                onClick={() => alternar(f)}
                aria-label={`Remover: ${f.texto}`}
                className="-my-2 -mr-1 inline-flex min-h-11 w-9 shrink-0 items-center justify-center text-white/60 hover:text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
