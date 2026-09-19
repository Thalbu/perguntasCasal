"use client";

import { MODO_POR_ID } from "@/data";
import { useHistorico } from "@/lib/historico";

const data = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

export function Historico() {
  const { partidas, limpar, pronto } = useHistorico();
  if (!pronto || partidas.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-white">Últimas partidas</h2>
        <button
          onClick={limpar}
          className="text-xs text-white/70 underline underline-offset-2 hover:text-white"
        >
          limpar
        </button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {partidas.slice(0, 5).map((p) => (
          <li key={p.quando} className="flex items-center gap-2 text-sm text-white/90">
            <span aria-hidden>{MODO_POR_ID[p.modo]?.emoji ?? "•"}</span>
            <span className="truncate">{MODO_POR_ID[p.modo]?.nome ?? p.modo}</span>
            {p.placar && (
              <span className="tabular-nums text-white/70">
                {p.placar[0]}–{p.placar[1]}
              </span>
            )}
            <time dateTime={p.quando} className="ml-auto shrink-0 text-xs text-white/60">
              {data.format(new Date(p.quando))}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
