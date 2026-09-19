"use client";

import { useCallback } from "react";
import { usePersistido } from "./armazenamento";

export type Perfil = {
  /** ISO curto (AAAA-MM-DD) — só data, sem hora. */
  desdeQuando: string;
  apelidoDoCasal: string;
  nossaMusica: string;
  primeiroEncontro: string;
};

export const PERFIL_VAZIO: Perfil = {
  desdeQuando: "",
  apelidoDoCasal: "",
  nossaMusica: "",
  primeiroEncontro: "",
};

/** Dias desde a data de início. Null quando a data não foi preenchida. */
export function diasJuntos(desdeQuando: string): number | null {
  if (!desdeQuando) return null;
  const inicio = new Date(`${desdeQuando}T00:00:00`);
  if (Number.isNaN(inicio.getTime())) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.floor((hoje.getTime() - inicio.getTime()) / 86_400_000);
  return dias >= 0 ? dias : null;
}

export function usePerfil() {
  const { valor, salvar, pronto } = usePersistido<Perfil>("perfil", PERFIL_VAZIO);
  const definir = useCallback(
    (campo: keyof Perfil, v: string) => salvar({ ...valor, [campo]: v }),
    [salvar, valor],
  );
  return { perfil: valor, salvar, definir, pronto };
}
