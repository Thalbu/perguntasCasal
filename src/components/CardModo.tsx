"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Modo } from "@/data";

export function CardModo({ modo, indice }: { modo: Modo; indice: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * indice, type: "spring", stiffness: 260, damping: 24 }}
      whileTap={{ scale: 0.97 }}
      className="h-full"
    >
      <Link
        href={`/jogar/${modo.id}`}
        className="flex h-full items-center gap-4 rounded-[var(--radius-card)] bg-creme/95 p-5 text-left shadow-[var(--shadow-card)] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
      >
        <span aria-hidden className="text-4xl">
          {modo.emoji}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-2xl text-vinho">{modo.nome}</span>
          <span className="block text-sm text-carvao/70">{modo.tagline}</span>
        </span>
      </Link>
    </motion.div>
  );
}
