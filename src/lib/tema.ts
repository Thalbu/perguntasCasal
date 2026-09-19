"use client";

import { useCallback } from "react";
import { usePersistido } from "./armazenamento";

export type Tema = "claro" | "escuro";

export function useTema() {
  const { valor, salvar, pronto } = usePersistido<Tema>("tema", "claro");

  const alternar = useCallback(() => {
    const novo: Tema = valor === "escuro" ? "claro" : "escuro";
    salvar(novo);
    document.documentElement.dataset.tema = novo;
  }, [salvar, valor]);

  /** Aplica no <html> sem esperar evento — chamado no primeiro paint. */
  const aplicar = useCallback((t: Tema) => {
    document.documentElement.dataset.tema = t;
  }, []);

  return { tema: valor, alternar, aplicar, pronto };
}
