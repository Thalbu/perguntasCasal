"use client";

import { useCallback } from "react";
import { usePersistido } from "./armazenamento";

export type Favorita = { id: string; texto: string; quando: string };

const VAZIO: Favorita[] = [];

export function useFavoritas() {
  const { valor, atualizar, salvar, pronto } = usePersistido<Favorita[]>(
    "favoritas",
    VAZIO,
  );

  const alternar = useCallback(
    (carta: { id: string; texto: string }) =>
      atualizar((atual) =>
        atual.some((f) => f.id === carta.id)
          ? atual.filter((f) => f.id !== carta.id)
          : [{ ...carta, quando: new Date().toISOString() }, ...atual],
      ),
    [atualizar],
  );

  const limpar = useCallback(() => salvar([]), [salvar]);

  return { favoritas: valor, alternar, limpar, pronto };
}
