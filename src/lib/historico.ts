"use client";

import { useCallback } from "react";
import type { ModoId } from "@/data";
import { usePersistido } from "./armazenamento";

export type Partida = {
  /** ISO. Guardado como string porque o localStorage só devolve JSON. */
  quando: string;
  modo: ModoId;
  perguntas: number;
  placar?: [number, number];
};

const LIMITE = 20;

const VAZIO: Partida[] = [];

/**
 * Os ids dos modos mudaram quando o banco virou categorias. Quem já jogou
 * tem partidas gravadas com os nomes antigos; sem isto o histórico delas
 * apareceria como texto cru.
 */
const RENOMEADOS: Record<string, ModoId> = {
  conhecer: "nos-dois",
  "conhece-me": "adivinhar",
};

const migrar = (p: Partida): Partida =>
  p.modo in RENOMEADOS ? { ...p, modo: RENOMEADOS[p.modo] } : p;

export function useHistorico() {
  const { valor, salvar, atualizar, pronto } = usePersistido<Partida[]>(
    "historico",
    VAZIO,
  );

  // atualizar (e não salvar) porque este callback é memoizado pelo chamador e
  // não pode partir da lista capturada no render em que nasceu
  const registrar = useCallback(
    (partida: Partida) => atualizar((atual) => [partida, ...atual].slice(0, LIMITE)),
    [atualizar],
  );

  const limpar = useCallback(() => salvar([]), [salvar]);

  return { partidas: valor.map(migrar), registrar, limpar, pronto };
}
