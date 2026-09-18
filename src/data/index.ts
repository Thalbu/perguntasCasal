import { conhecer } from "./conhecer";
import { conheceMe } from "./conhece-me";
import { picante } from "./picante";
import type { ModoId, Pergunta } from "./tipos";

const BANCO: Record<ModoId, Pergunta[]> = {
  conhecer,
  picante,
  "conhece-me": conheceMe,
};

/** Perguntas de um modo, opcionalmente limitadas a um nível de ousadia. */
export function perguntasDo(modo: ModoId, nivelMaximo?: number): Pergunta[] {
  const todas = BANCO[modo];
  if (nivelMaximo === undefined) return todas;
  return todas.filter((p) => (p.nivel ?? 1) <= nivelMaximo);
}

export * from "./tipos";
