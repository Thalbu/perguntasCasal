"use client";

import { useState } from "react";
import { Botao } from "@/components/Botao";
import { useCasal } from "@/lib/armazenamento";
import { useRespostaDoDia } from "@/lib/pergunta-do-dia";

const data = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" });

export function PerguntaDoDia() {
  const { valor: casal } = useCasal();
  const { pergunta, resposta, responder, pronto } = useRespostaDoDia();
  const [editando, setEditando] = useState<"a" | "b" | null>(null);
  const [rascunho, setRascunho] = useState("");

  if (!pronto) return null;

  const nomes = { a: casal.a || "Você", b: casal.b || "Amor" };
  const ambos = Boolean(resposta.a && resposta.b);
  const texto = pergunta.texto.replaceAll("{alvo}", nomes.b);

  return (
    <section className="rounded-[var(--radius-card)] bg-creme/95 p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold tracking-wide text-carvao/55 uppercase">
        💌 Pergunta de {data.format(new Date())}
      </p>
      <p className="mt-2 font-display text-2xl leading-snug text-vinho">{texto}</p>

      {editando ? (
        <div className="mt-3">
          <textarea
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            rows={3}
            maxLength={500}
            autoFocus
            placeholder={`${nomes[editando]}, escreva sem mostrar`}
            className="w-full rounded-2xl bg-white p-3 text-carvao ring-1 ring-carvao/15 placeholder:text-carvao/35 focus:outline-2 focus:outline-vinho"
          />
          <div className="mt-2 flex gap-2">
            <Botao
              className="flex-1"
              onClick={() => {
                responder(editando, rascunho);
                setRascunho("");
                setEditando(null);
              }}
            >
              Guardar
            </Botao>
            <Botao
              variante="fantasma"
              className="flex-1 !text-carvao !ring-carvao/25"
              onClick={() => {
                setRascunho("");
                setEditando(null);
              }}
            >
              Cancelar
            </Botao>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {(["a", "b"] as const).map((quem) => (
            <div key={quem} className="flex items-center gap-2 text-sm">
              <span className="w-24 shrink-0 truncate font-semibold text-carvao/70">
                {nomes[quem]}
              </span>
              {resposta[quem] ? (
                ambos ? (
                  <span className="flex-1 text-carvao">{resposta[quem]}</span>
                ) : (
                  <span className="flex-1 text-carvao/50">respondeu ✓</span>
                )
              ) : (
                <button
                  onClick={() => setEditando(quem)}
                  className="min-h-11 flex-1 text-left text-vinho underline underline-offset-4"
                >
                  responder
                </button>
              )}
            </div>
          ))}
          {!ambos && resposta.a && resposta.b === "" && (
            <p className="text-xs text-carvao/50">
              As duas respostas aparecem quando {nomes.b} responder.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
