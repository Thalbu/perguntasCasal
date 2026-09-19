"use client";

import { useCallback } from "react";
import type { Carta, CategoriaId, Nivel } from "@/data";
import { usePersistido } from "./armazenamento";

/**
 * Perguntas escritas pelo próprio casal. Entram no sorteio junto com as do
 * app — é o que separa "app de perguntas" de "o nosso app".
 */
export type Minha = {
  id: string;
  texto: string;
  categoria: CategoriaId;
  nivel: Nivel;
};

const VAZIO: Minha[] = [];

export function useMinhas() {
  const { valor, atualizar, pronto } = usePersistido<Minha[]>("minhas", VAZIO);

  const adicionar = useCallback(
    (texto: string, categoria: CategoriaId, nivel: Nivel) =>
      atualizar((atual) => [
        {
          // o timestamp basta: são criadas uma por vez, pela mão
          id: `nossa-${Date.now()}`,
          texto: texto.trim(),
          categoria,
          nivel,
        },
        ...atual,
      ]),
    [atualizar],
  );

  const remover = useCallback(
    (id: string) => atualizar((atual) => atual.filter((m) => m.id !== id)),
    [atualizar],
  );

  return { minhas: valor, adicionar, remover, pronto };
}

export const comoCarta = (m: Minha): Carta => ({
  tipo: "pergunta",
  id: m.id,
  texto: m.texto,
  nivel: m.nivel,
});
