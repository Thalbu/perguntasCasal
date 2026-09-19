"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * Card com virada 3D. O verso existe por um motivo prático: no modo
 * passa-e-joga quem não é da vez não deve ler a pergunta antes da hora.
 */
export function CardPergunta({
  texto,
  chamada,
  dica,
  aberto,
  onAbrir,
  variante = "pergunta",
}: {
  texto: string;
  chamada: string;
  dica: string;
  aberto: boolean;
  onAbrir: () => void;
  /** desafio ganha frente escura: é uma carta de ação, não de conversa */
  variante?: "pergunta" | "desafio";
}) {
  return (
    <div className="[perspective:1400px]">
      <motion.button
        type="button"
        onClick={() => {
          // vibração curta: o celular confirma a virada sem barulho
          navigator.vibrate?.(12);
          onAbrir();
        }}
        disabled={aberto}
        aria-live="polite"
        aria-label={aberto ? texto : `${chamada}. ${dica}`}
        animate={{ rotateY: aberto ? 0 : 180 }}
        initial={false}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="carta grid w-full [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {/* frente: a pergunta */}
        <span
          className={`col-start-1 row-start-1 flex items-center rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] sm:p-8 [backface-visibility:hidden] ${
            variante === "desafio" ? "bg-vinho" : "bg-creme"
          }`}
        >
          <span
            className={`texto-carta font-display text-left ${
              variante === "desafio" ? "text-creme" : "text-vinho"
            }`}
          >
            {texto}
          </span>
        </span>

        {/* verso: o convite pra virar */}
        <span className="col-start-1 row-start-1 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] bg-vinho p-6 text-center shadow-[var(--shadow-card)] sm:p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="texto-carta font-display text-creme">{chamada}</span>
          <span className="text-sm text-creme/70">{dica}</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {!aberto && (
          <motion.p
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-sm text-white/70"
          >
            Toque no card
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
