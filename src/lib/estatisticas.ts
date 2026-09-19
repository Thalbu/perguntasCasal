"use client";

import { MODO_POR_ID, type ModoId } from "@/data";
import { useFavoritas } from "./favoritas";
import { useHistorico } from "./historico";
import { useMemorias } from "./memorias";
import { useVistas } from "./vistas";

export type Conquista = {
  id: string;
  emoji: string;
  nome: string;
  comoGanhar: string;
  ganha: boolean;
};

export type Estatisticas = {
  respondidas: number;
  partidas: number;
  memorias: number;
  favoritas: number;
  diasJogando: number;
  acertos: number;
  totalChutes: number;
  /** modo mais jogado, se houver partidas */
  favorito: { id: ModoId; nome: string; emoji: string; vezes: number } | null;
  conquistas: Conquista[];
};

export function useEstatisticas(): Estatisticas & { pronto: boolean } {
  const { partidas, pronto: p1 } = useHistorico();
  const { vistas, pronto: p2 } = useVistas();
  const { memorias, pronto: p3 } = useMemorias();
  const { favoritas, pronto: p4 } = useFavoritas();

  const vezes = new Map<ModoId, number>();
  let acertos = 0;
  let totalChutes = 0;
  for (const p of partidas) {
    vezes.set(p.modo, (vezes.get(p.modo) ?? 0) + 1);
    if (p.placar) {
      acertos += p.placar[0] + p.placar[1];
      totalChutes += p.perguntas;
    }
  }

  const topo = [...vezes.entries()].sort((a, b) => b[1] - a[1])[0];
  const favorito = topo
    ? {
        id: topo[0],
        nome: MODO_POR_ID[topo[0]]?.nome ?? topo[0],
        emoji: MODO_POR_ID[topo[0]]?.emoji ?? "•",
        vezes: topo[1],
      }
    : null;

  // dias distintos em que houve partida, não dias corridos desde a primeira
  const diasJogando = new Set(partidas.map((p) => p.quando.slice(0, 10))).size;
  const respondidas = vistas.length;
  const precisao = totalChutes === 0 ? 0 : acertos / totalChutes;

  const conquistas: Conquista[] = [
    {
      id: "primeira",
      emoji: "🏆",
      nome: "Primeira noite",
      comoGanhar: "Terminar uma partida",
      ganha: partidas.length >= 1,
    },
    {
      id: "cem",
      emoji: "💯",
      nome: "Cem perguntas",
      comoGanhar: "Responder 100 perguntas",
      ganha: respondidas >= 100,
    },
    {
      id: "conexao",
      emoji: "❤️",
      nome: "Conexão",
      comoGanhar: "Acertar 20 respostas um sobre o outro",
      ganha: acertos >= 20,
    },
    {
      id: "telepatia",
      emoji: "🧠",
      nome: "Telepatia",
      comoGanhar: "Chegar a 90% de acerto com 20 chutes ou mais",
      ganha: totalChutes >= 20 && precisao >= 0.9,
    },
    {
      id: "corajosos",
      emoji: "🔥",
      nome: "Corajosos",
      comoGanhar: "Terminar uma partida no nível sem filtro",
      ganha: partidas.some((p) => p.modo === "picante" || p.modo === "noite"),
    },
    {
      id: "profundos",
      emoji: "💭",
      nome: "Fundo de verdade",
      comoGanhar: "Terminar uma Conversa profunda",
      ganha: partidas.some((p) => p.modo === "profunda"),
    },
    {
      id: "album",
      emoji: "📸",
      nome: "Nosso álbum",
      comoGanhar: "Guardar 5 memórias",
      ganha: memorias.length >= 5,
    },
    {
      id: "constantes",
      emoji: "🗓️",
      nome: "Constantes",
      comoGanhar: "Jogar em 7 dias diferentes",
      ganha: diasJogando >= 7,
    },
  ];

  return {
    respondidas,
    partidas: partidas.length,
    memorias: memorias.length,
    favoritas: favoritas.length,
    diasJogando,
    acertos,
    totalChutes,
    favorito,
    conquistas,
    pronto: p1 && p2 && p3 && p4,
  };
}
