"use client";

import { BANCO, type Pergunta } from "@/data";
import { usePersistido } from "./armazenamento";

/** AAAA-MM-DD no fuso do aparelho. */
export function hoje(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Hash estável de string. Precisa ser determinístico: a mesma data tem que
 *  dar a mesma pergunta pros dois, hoje e daqui a um ano. */
function embaralhaTexto(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * A pergunta do dia sai da data, não de sorteio: sem servidor, é assim que
 * os dois veem a mesma sem combinar nada.
 */
export function perguntaDoDia(dia = hoje()): Pergunta {
  const pool = BANCO.filter((p) => p.nivel <= 3 && p.categoria !== "adivinhar");
  return pool[embaralhaTexto(dia) % pool.length];
}

export type RespostaDoDia = { dia: string; a: string; b: string };

export function useRespostaDoDia() {
  const dia = hoje();
  const { valor, salvar, pronto } = usePersistido<RespostaDoDia>("do-dia", {
    dia,
    a: "",
    b: "",
  });

  // virou o dia: o registro de ontem não vale mais
  const atual = valor.dia === dia ? valor : { dia, a: "", b: "" };

  return {
    dia,
    pergunta: perguntaDoDia(dia),
    resposta: atual,
    responder: (quem: "a" | "b", texto: string) =>
      salvar({ ...atual, [quem]: texto }),
    pronto,
  };
}
