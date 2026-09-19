"use client";

import { useState } from "react";
import { useEstatisticas } from "@/lib/estatisticas";

export function Estatisticas() {
  const e = useEstatisticas();
  const [aberto, setAberto] = useState(false);

  if (!e.pronto || e.partidas === 0) return null;

  const precisao =
    e.totalChutes === 0 ? null : Math.round((e.acertos / e.totalChutes) * 100);
  const ganhas = e.conquistas.filter((c) => c.ganha).length;

  return (
    <section className="rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="min-h-11 text-sm font-semibold text-white"
      >
        📊 Nossos números ({ganhas}/{e.conquistas.length} conquistas){" "}
        {aberto ? "▴" : "▾"}
      </button>

      {aberto && (
        <>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <Numero rotulo="Perguntas respondidas" valor={e.respondidas} />
            <Numero rotulo="Partidas" valor={e.partidas} />
            <Numero rotulo="Dias jogando" valor={e.diasJogando} />
            <Numero rotulo="Memórias" valor={e.memorias} />
            {precisao !== null && <Numero rotulo="Acerto nos chutes" valor={`${precisao}%`} />}
            {e.favorito && (
              <Numero
                rotulo="Modo favorito"
                valor={`${e.favorito.emoji} ${e.favorito.nome}`}
              />
            )}
          </dl>

          <ul className="mt-3 flex flex-col gap-1.5 border-t border-white/20 pt-3">
            {e.conquistas.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-2 text-sm ${
                  c.ganha ? "text-white" : "text-white/45"
                }`}
              >
                <span aria-hidden className={c.ganha ? "" : "grayscale"}>
                  {c.emoji}
                </span>
                <span className="font-medium">{c.nome}</span>
                <span className="ml-auto text-right text-xs text-white/50">
                  {c.ganha ? "conquistada" : c.comoGanhar}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string | number }) {
  return (
    <div className="rounded-xl bg-white/10 p-2">
      <dt className="text-xs text-white/60">{rotulo}</dt>
      <dd className="truncate font-display text-xl text-white">{valor}</dd>
    </div>
  );
}
