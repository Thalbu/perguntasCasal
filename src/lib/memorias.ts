"use client";

import { useCallback } from "react";
import { usePersistido } from "./armazenamento";

export const REACOES = [
  { id: "amei", emoji: "❤️", rotulo: "Amei" },
  { id: "ri", emoji: "😂", rotulo: "Ri muito" },
  { id: "fofo", emoji: "🥹", rotulo: "Que fofo" },
  { id: "surpresa", emoji: "😳", rotulo: "Não esperava" },
  { id: "gostei", emoji: "🔥", rotulo: "Gostei" },
  { id: "conversar", emoji: "🤔", rotulo: "Precisamos conversar" },
] as const;

export type ReacaoId = (typeof REACOES)[number]["id"];

export type Memoria = {
  id: string;
  quando: string;
  pergunta: string;
  respostas: [string, string];
  nomes: [string, string];
  reacao?: ReacaoId;
};

const VAZIO: Memoria[] = [];

export function useMemorias() {
  const { valor, atualizar, salvar, pronto } = usePersistido<Memoria[]>(
    "memorias",
    VAZIO,
  );

  /** Devolve o id criado, pra quem guardou poder reagir logo em seguida. */
  const guardar = useCallback(
    (m: Omit<Memoria, "id" | "quando">) => {
      const id = `me-${Date.now()}`;
      atualizar((atual) => [
        { ...m, id, quando: new Date().toISOString() },
        ...atual,
      ]);
      return id;
    },
    [atualizar],
  );

  const reagir = useCallback(
    (id: string, reacao: ReacaoId) =>
      atualizar((atual) =>
        atual.map((m) =>
          m.id === id ? { ...m, reacao: m.reacao === reacao ? undefined : reacao } : m,
        ),
      ),
    [atualizar],
  );

  const remover = useCallback(
    (id: string) => atualizar((atual) => atual.filter((m) => m.id !== id)),
    [atualizar],
  );

  const limpar = useCallback(() => salvar([]), [salvar]);

  return { memorias: valor, guardar, reagir, remover, limpar, pronto };
}
