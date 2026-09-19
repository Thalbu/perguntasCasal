"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

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
  // o inicial costuma ser um literal novo a cada render; a ref o estabiliza
  const inicialRef = useRef(inicial);

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

  const decodificar = (bruto: string | null | undefined): T => {
    if (!bruto) return inicial;
    try {
      return JSON.parse(bruto) as T;
    } catch {
      // JSON corrompido: cai no inicial
      return inicial;
    }
  };

  const valor = decodificar(cru);
  /**
   * Atualiza a partir do que está gravado agora, não do valor capturado no
   * render. Sem isso, um callback memoizado gravaria por cima de escritas
   * feitas depois que ele foi criado.
   */
  const atualizar = useCallback(
    (fn: (atual: T) => T) => {
      const bruto = ler(chave);
      let base = inicialRef.current;
      if (bruto) {
        try {
          base = JSON.parse(bruto) as T;
        } catch {
          // JSON corrompido: parte do inicial
        }
      }
      salvar(fn(base));
    },
    [chave, salvar],
  );

  return { valor, salvar, atualizar, pronto: cru !== undefined };
}

export type Casal = { a: string; b: string };

export const CASAL_VAZIO: Casal = { a: "", b: "" };

export const useCasal = () => usePersistido<Casal>("casal", CASAL_VAZIO);
