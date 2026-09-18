"use client";

import { useCallback, useState } from "react";
import type { Pergunta } from "@/data";
import { embaralhar } from "./embaralhar";

export const PERGUNTAS_POR_SESSAO = 12;

export type Fase = "intro" | "jogando" | "fim";

export type Rodada = {
  pergunta: Pergunta;
  /** 0 = quem começou, 1 = o par. Alterna a cada pergunta. */
  vez: 0 | 1;
  /** só nos modos com placar */
  acertou?: boolean;
};

export type Sessao = {
  fase: Fase;
  rodadas: Rodada[];
  indice: number;
  atual: Rodada | undefined;
  total: number;
  placar: [number, number];
  /** Sorteia as perguntas e entra em jogo. Chamado num evento, nunca no
   *  render — o embaralhamento é aleatório e quebraria a hidratação. */
  comecar: (opcoes?: { nivelMaximo?: number }) => void;
  /** Avança. `acertou` só é lido nos modos com placar. */
  avancar: (acertou?: boolean) => void;
  reiniciar: () => void;
};

export function useSessao(banco: (nivelMaximo?: number) => Pergunta[]): Sessao {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<Fase>("intro");

  const comecar = useCallback(
    (opcoes?: { nivelMaximo?: number }) => {
      const sorteadas = embaralhar(banco(opcoes?.nivelMaximo)).slice(
        0,
        PERGUNTAS_POR_SESSAO,
      );
      setRodadas(
        sorteadas.map((pergunta, i) => ({
          pergunta,
          vez: (i % 2) as 0 | 1,
        })),
      );
      setIndice(0);
      setFase("jogando");
    },
    [banco],
  );

  const avancar = useCallback(
    (acertou?: boolean) => {
      setRodadas((atuais) =>
        atuais.map((r, i) => (i === indice ? { ...r, acertou } : r)),
      );
      if (indice + 1 >= rodadas.length) setFase("fim");
      else setIndice(indice + 1);
    },
    [indice, rodadas.length],
  );

  const reiniciar = useCallback(() => {
    setRodadas([]);
    setIndice(0);
    setFase("intro");
  }, []);

  const placar = rodadas.reduce<[number, number]>(
    (acc, r) => {
      if (r.acertou) acc[r.vez] += 1;
      return acc;
    },
    [0, 0],
  );

  return {
    fase,
    rodadas,
    indice,
    atual: rodadas[indice],
    total: rodadas.length,
    placar,
    comecar,
    avancar,
    reiniciar,
  };
}
