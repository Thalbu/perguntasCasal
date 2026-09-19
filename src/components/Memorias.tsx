"use client";

import { useState } from "react";
import { REACOES, useMemorias } from "@/lib/memorias";

const data = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function Memorias() {
  const { memorias, remover, pronto } = useMemorias();
  const [aberto, setAberto] = useState(false);

  if (!pronto || memorias.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="min-h-11 text-sm font-semibold text-white"
      >
        📸 Nossas memórias ({memorias.length}) {aberto ? "▴" : "▾"}
      </button>

      {aberto && (
        <ul className="mt-2 flex flex-col gap-3">
          {memorias.map((m) => {
            const r = REACOES.find((x) => x.id === m.reacao);
            return (
              <li key={m.id} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-start gap-2">
                  <time
                    dateTime={m.quando}
                    className="text-xs text-white/60"
                  >
                    {data.format(new Date(m.quando))}
                  </time>
                  {r && (
                    <span className="text-xs text-white/75">
                      {r.emoji} {r.rotulo}
                    </span>
                  )}
                  <button
                    onClick={() => remover(m.id)}
                    aria-label={`Apagar memória: ${m.pergunta}`}
                    className="ml-auto px-1 text-white/50 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-1 font-display text-lg text-white">{m.pergunta}</p>

                {m.nomes.map((nome, i) => (
                  <p key={nome + i} className="mt-1 text-sm text-white/85">
                    <span className="font-semibold">{nome}:</span>{" "}
                    {m.respostas[i].trim() || "—"}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
