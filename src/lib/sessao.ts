"use client";

import { useCallback, useState } from "react";
import type { Carta, Modo, Nivel } from "@/data";
import { montarBaralho } from "./baralho";

export const PERGUNTAS_POR_SESSAO = 12;

export type Fase = "intro" | "jogando" | "fim";

export type Rodada = {
  carta: Carta;
  /** 0 = quem começou, 1 = o par. Alterna a cada carta. */
  vez: 0 | 1;
  /** modos com placar: acertou o chute */
  acertou?: boolean;
  /** modo "Eu ou você?": em quem os dois apontaram */
  apontado?: 0 | 1;
};

export type Resultado = {
  /** acertos por pessoa, nos modos que pontuam */
  placar: [number, number];
  /** vezes que cada um foi apontado, no "Eu ou você?" */
  apontamentos: [number, number];
};

export type Sessao = Resultado & {
  fase: Fase;
  rodadas: Rodada[];
  indice: number;
  atual: Rodada | undefined;
  total: number;
  /**
   * Sorteia as cartas e entra em jogo. Chamado num evento, nunca no render —
   * o embaralhamento é aleatório e quebraria a hidratação.
   */
  comecar: (nivel?: Nivel) => void;
  /** Avança registrando o que aconteceu nesta carta. */
  avancar: (registro?: { acertou?: boolean; apontado?: 0 | 1 }) => void;
  reiniciar: () => void;
};

function contar(rodadas: Rodada[]): Resultado {
  const placar: [number, number] = [0, 0];
  const apontamentos: [number, number] = [0, 0];
  for (const r of rodadas) {
    if (r.acertou) placar[r.vez] += 1;
    if (r.apontado !== undefined) apontamentos[r.apontado] += 1;
  }
  return { placar, apontamentos };
}

export function useSessao(
  modo: Modo,
  /** chamado no fim da última rodada, ainda dentro do evento de clique */
  aoTerminar?: (resultado: Resultado, cartas: number) => void,
): Sessao {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<Fase>("intro");

  const comecar = useCallback(
    (nivel?: Nivel) => {
      const cartas = montarBaralho(modo, nivel);
      setRodadas(cartas.map((carta, i) => ({ carta, vez: (i % 2) as 0 | 1 })));
      setIndice(0);
      setFase("jogando");
    },
    [modo],
  );

  const avancar = useCallback(
    (registro?: { acertou?: boolean; apontado?: 0 | 1 }) => {
      const atualizadas = rodadas.map((r, i) =>
        i === indice ? { ...r, ...registro } : r,
      );
      setRodadas(atualizadas);

      if (indice + 1 < atualizadas.length) {
        setIndice(indice + 1);
        return;
      }

      setFase("fim");
      // registrado aqui, no evento, e não num efeito reagindo à fase
      aoTerminar?.(contar(atualizadas), atualizadas.length);
    },
    [aoTerminar, indice, rodadas],
  );

  const reiniciar = useCallback(() => {
    setRodadas([]);
    setIndice(0);
    setFase("intro");
  }, []);

  return {
    fase,
    rodadas,
    indice,
    atual: rodadas[indice],
    total: rodadas.length,
    ...contar(rodadas),
    comecar,
    avancar,
    reiniciar,
  };
}
