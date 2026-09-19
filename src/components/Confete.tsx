"use client";

import { motion } from "motion/react";

const CORES = ["#ff6b6b", "#ff8fa3", "#ffc48c", "#fff8f3"];
const QUANTIDADE = 14;

/**
 * Explosão curta de papelzinho. Puro motion — carregar uma biblioteca de
 * confete para catorze quadradinhos não se paga.
 *
 * As trajetórias são derivadas do índice, não sorteadas: Math.random durante
 * o render é impuro e recalcularia a cada re-render.
 */
const PECAS = Array.from({ length: QUANTIDADE }, (_, i) => {
  const angulo = (Math.PI * (i + 0.5)) / QUANTIDADE; // meio círculo para cima
  const alcance = 150 + (i % 4) * 34;
  return {
    x: Math.cos(angulo) * alcance,
    y: -Math.sin(angulo) * alcance,
    giro: (i % 2 === 0 ? 1 : -1) * (180 + i * 25),
    atraso: (i % 5) * 0.03,
    cor: CORES[i % CORES.length],
  };
});

export function Confete({ semente }: { semente: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {PECAS.map((p, i) => (
        <motion.span
          key={`${semente}-${i}`}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.giro }}
          transition={{ duration: 0.9, delay: p.atraso, ease: "easeOut" }}
          style={{ background: p.cor }}
          className="absolute h-2 w-2 rounded-[2px]"
        />
      ))}
    </div>
  );
}
