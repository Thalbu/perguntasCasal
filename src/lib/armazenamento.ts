"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Estado persistido no localStorage. Some no SSR e volta no primeiro efeito,
 * por isso `pronto` — sem ele a home pisca o formulário de nomes.
 */
export function usePersistido<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(inicial);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const cru = localStorage.getItem(chave);
      if (cru !== null) setValor(JSON.parse(cru) as T);
    } catch {
      // storage bloqueado ou JSON corrompido: segue com o valor inicial
    }
    setPronto(true);
  }, [chave]);

  const salvar = useCallback(
    (novo: T) => {
      setValor(novo);
      try {
        localStorage.setItem(chave, JSON.stringify(novo));
      } catch {
        // modo privado: o jogo continua, só não persiste
      }
    },
    [chave],
  );

  return { valor, salvar, pronto };
}

export type Casal = { a: string; b: string };

export const CASAL_VAZIO: Casal = { a: "", b: "" };

export const useCasal = () => usePersistido<Casal>("casal", CASAL_VAZIO);
