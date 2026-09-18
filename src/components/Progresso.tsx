"use client";

import { motion } from "motion/react";

export function Progresso({ atual, total }: { atual: number; total: number }) {
  const pct = total === 0 ? 0 : (atual / total) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={atual}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${atual} de ${total} perguntas concluídas`}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/30"
    >
      <motion.div
        className="h-full rounded-full bg-white"
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />
    </div>
  );
}
