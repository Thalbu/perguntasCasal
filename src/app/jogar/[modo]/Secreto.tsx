"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Botao } from "@/components/Botao";
import { REACOES, useMemorias, type ReacaoId } from "@/lib/memorias";

type Etapa = "primeiro" | "passando" | "segundo" | "revelado";

/**
 * O passa-e-joga é o que torna isto possível sem servidor: um escreve,
 * entrega o celular, o outro escreve sem ver, e só então os dois leem.
 */
export function Secreto({
  pergunta,
  nomes,
  onProxima,
}: {
  pergunta: string;
  nomes: [string, string];
  onProxima: () => void;
}) {
  const [etapa, setEtapa] = useState<Etapa>("primeiro");
  const [respostas, setRespostas] = useState<[string, string]>(["", ""]);
  const [guardada, setGuardada] = useState<string | null>(null);
  const [reacao, setReacao] = useState<ReacaoId | null>(null);
  const { guardar, reagir } = useMemorias();

  const escrevendo = etapa === "primeiro" ? 0 : 1;

  const definir = (v: string) =>
    setRespostas((r) => (escrevendo === 0 ? [v, r[1]] : [r[0], v]));

  const guardarMomento = () => {
    const id = guardar({ pergunta, respostas, nomes });
    setGuardada(id);
    if (reacao) reagir(id, reacao);
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <p className="rounded-[var(--radius-card)] bg-creme p-6 font-display text-2xl leading-snug text-vinho shadow-[var(--shadow-card)]">
        {pergunta}
      </p>

      <AnimatePresence mode="wait">
        {etapa === "passando" ? (
          <motion.div
            key="passando"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <p className="text-5xl" aria-hidden>
              🤫
            </p>
            <p className="text-white/90">
              Resposta de {nomes[0]} guardada.
              <br />
              Passe o celular para {nomes[1]}.
            </p>
            <Botao onClick={() => setEtapa("segundo")}>Sou {nomes[1]}</Botao>
          </motion.div>
        ) : etapa === "revelado" ? (
          <motion.div
            key="revelado"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {nomes.map((nome, i) => (
              <motion.div
                key={nome + i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="rounded-2xl bg-creme/95 p-4 text-left shadow-[var(--shadow-card)]"
              >
                <p className="text-xs font-semibold text-carvao/60 uppercase">{nome}</p>
                <p className="mt-1 whitespace-pre-wrap text-carvao">
                  {respostas[i].trim() || "— ficou em silêncio —"}
                </p>
              </motion.div>
            ))}

            <div className="flex flex-wrap justify-center gap-2">
              {REACOES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={reacao === r.id}
                  onClick={() => {
                    setReacao((atual) => (atual === r.id ? null : r.id));
                    if (guardada) reagir(guardada, r.id);
                  }}
                  className={`min-h-11 rounded-full px-3 text-sm ring-1 transition ${
                    reacao === r.id
                      ? "bg-creme text-vinho ring-white"
                      : "bg-white/15 text-white ring-white/30"
                  }`}
                >
                  <span aria-hidden>{r.emoji}</span> {r.rotulo}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-col items-center gap-3">
              <Botao
                variante="fantasma"
                onClick={guardarMomento}
                disabled={guardada !== null}
              >
                {guardada ? "Guardado nas memórias ✓" : "Guardar este momento"}
              </Botao>
              <Botao onClick={onProxima}>Próxima</Botao>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`escrevendo-${escrevendo}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <label className="text-sm text-white/90">
              {nomes[escrevendo]}, escreva sem mostrar
              <textarea
                value={respostas[escrevendo]}
                onChange={(e) => definir(e.target.value)}
                rows={4}
                maxLength={500}
                autoFocus
                className="mt-1 w-full rounded-2xl bg-white/90 p-3 text-carvao placeholder:text-carvao/35 focus:outline-2 focus:outline-offset-2 focus:outline-white"
                placeholder="A sua resposta fica escondida até os dois responderem."
              />
            </label>
            <Botao
              className="self-center"
              onClick={() => setEtapa(escrevendo === 0 ? "passando" : "revelado")}
            >
              {escrevendo === 0 ? "Pronto, esconder" : "Revelar as duas"}
            </Botao>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
