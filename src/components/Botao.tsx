"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  variante?: "solido" | "fantasma";
};

/** Botão com afundada no toque. Alvo mínimo de 48px pra dedo no celular. */
export function Botao({ variante = "solido", className = "", ...props }: Props) {
  const estilo =
    variante === "solido"
      ? "bg-vinho text-creme shadow-lg hover:brightness-110"
      : "bg-white/20 text-white ring-1 ring-white/50 backdrop-blur hover:bg-white/30";

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`min-h-12 rounded-full px-7 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white ${estilo} ${className}`}
      {...(props as ComponentProps<typeof motion.button>)}
    />
  );
}
