"use client";

import { useCallback } from "react";
import { usePersistido } from "./armazenamento";

/**
 * Ids já sorteados em sessões anteriores. Com mais de mil cartas a
 * repetição não vem por esgotamento — vem por azar do sorteio, e bem antes
 * do que parece.
 */
const VAZIO: string[] = [];

/** Acima disto o baralho reinicia: melhor repetir que ficar sem carta. */
const TETO = 5000;

export function useVistas() {
  const { valor, atualizar, salvar, pronto } = usePersistido<string[]>("vistas", VAZIO);

  const marcar = useCallback(
    (ids: string[]) =>
      atualizar((atual) => [...new Set([...atual, ...ids])].slice(-TETO)),
    [atualizar],
  );

  const limpar = useCallback(() => salvar([]), [salvar]);

  return { vistas: valor, marcar, limpar, pronto };
}

/**
 * Tira o que já foi visto. Se sobrar pouco, devolve o pool inteiro: é
 * preferível repetir a entregar uma sessão de três cartas.
 */
export function inedito<T extends { id: string }>(
  pool: T[],
  vistas: Set<string>,
  minimo: number,
): T[] {
  const novos = pool.filter((x) => !vistas.has(x.id));
  return novos.length >= minimo ? novos : pool;
}
