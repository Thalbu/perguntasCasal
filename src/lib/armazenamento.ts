"use client";

import { useCallback, useSyncExternalStore } from "react";

const ouvintes = new Set<() => void>();

function inscrever(fn: () => void) {
  ouvintes.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    ouvintes.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

function ler(chave: string) {
  try {
    return localStorage.getItem(chave);
  } catch {
    // modo privado ou storage bloqueado
    return null;
  }
}

/**
 * Estado espelhado no localStorage. Via useSyncExternalStore para não
 * escrever estado dentro de efeito na hidratação.
 *
 * `pronto` é false no servidor e no primeiro render do cliente: sem isso a
 * home pisca o formulário de nomes antes de saber que já existem nomes.
 */
export function usePersistido<T>(chave: string, inicial: T) {
  // undefined = ainda não hidratou (render do servidor). null = hidratou e
  // não há nada guardado. Os dois casos precisam ser distinguíveis.
  const cru = useSyncExternalStore<string | null | undefined>(
    inscrever,
    () => ler(chave),
    () => undefined,
  );

  const salvar = useCallback(
    (novo: T) => {
      try {
        localStorage.setItem(chave, JSON.stringify(novo));
      } catch {
        // o jogo continua, só não persiste
      }
      ouvintes.forEach((fn) => fn());
    },
    [chave],
  );

  let valor = inicial;
  if (cru) {
    try {
      valor = JSON.parse(cru) as T;
    } catch {
      // JSON corrompido: cai no inicial
    }
  }

  return { valor, salvar, pronto: cru !== undefined };
}

export type Casal = { a: string; b: string };

export const CASAL_VAZIO: Casal = { a: "", b: "" };

export const useCasal = () => usePersistido<Casal>("casal", CASAL_VAZIO);
