"use client";

import { useCallback, useState } from "react";
import type { Pergunta } from "@/data";
import { embaralhar } from "./embaralhar";

export const PERGUNTAS_POR_SESSAO = 12;

/** Quantas perguntas do nível mais baixo abrem a sessão. */
const ABERTURA = 3;

/**
 * Monta a sequência: começa pelo nível mais baixo disponível e sobe.
 * Sorteadas dentro de cada nível, nunca repetindo dentro da sessão.
 *
 * A subida importa: abrir uma noite com "qual seu medo sobre o nosso
 * futuro" trava a conversa antes dela começar.
 */
function montar(pool: Pergunta[], quantidade: number): Pergunta[] {
  const porNivel = new Map<number, Pergunta[]>();
  for (const p of pool) {
    porNivel.set(p.nivel, [...(porNivel.get(p.nivel) ?? []), p]);
  }

  const niveis = [...porNivel.keys()].sort((a, b) => a - b);
  const escada = niveis.flatMap((n) => embaralhar(porNivel.get(n)!));
  const maisBaixo = porNivel.get(niveis[0]) ?? [];

  if (maisBaixo.length === 0) return escada.slice(0, quantidade);

  const abertura = embaralhar(maisBaixo).slice(0, ABERTURA);
  const ids = new Set(abertura.map((p) => p.id));
  return [...abertura, ...escada.filter((p) => !ids.has(p.id))].slice(0, quantidade);
}

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

function contar(rodadas: Rodada[]): [number, number] {
  return rodadas.reduce<[number, number]>(
    (acc, r) => {
      if (r.acertou) acc[r.vez] += 1;
      return acc;
    },
    [0, 0],
  );
}

export function useSessao(
  banco: (nivelMaximo?: number) => Pergunta[],
  /** chamado no fim da última rodada, ainda dentro do evento de clique */
  aoTerminar?: (placar: [number, number], perguntas: number) => void,
): Sessao {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<Fase>("intro");

  const comecar = useCallback(
    (opcoes?: { nivelMaximo?: number }) => {
      const sorteadas = montar(banco(opcoes?.nivelMaximo), PERGUNTAS_POR_SESSAO);
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
      const atualizadas = rodadas.map((r, i) =>
        i === indice ? { ...r, acertou } : r,
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

  const placar = contar(rodadas);

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
