export type Nivel = 1 | 2 | 3;

export type Pergunta = {
  id: string;
  texto: string;
  /** só no modo picante: 1 = leve, 2 = quente, 3 = sem freio */
  nivel?: Nivel;
};

export type ModoId = "conhecer" | "picante" | "conhece-me";

export type Modo = {
  id: ModoId;
  nome: string;
  tagline: string;
  emoji: string;
  /** o modo pontua acertos em vez de só conversar */
  placar: boolean;
  /** o modo filtra perguntas por nível de ousadia */
  niveis: boolean;
};

export const MODOS: Modo[] = [
  {
    id: "conhecer",
    nome: "Conhecer Melhor",
    tagline: "As perguntas que a gente nunca para pra fazer",
    emoji: "🌙",
    placar: false,
    niveis: false,
  },
  {
    id: "picante",
    nome: "Picante",
    tagline: "Você escolhe o quanto quer se arriscar",
    emoji: "🔥",
    placar: false,
    niveis: true,
  },
  {
    id: "conhece-me",
    nome: "Você Me Conhece?",
    tagline: "Adivinha a resposta do outro e some pontos",
    emoji: "💘",
    placar: true,
    niveis: false,
  },
];

export const MODOS_POR_ID = Object.fromEntries(
  MODOS.map((m) => [m.id, m]),
) as Record<ModoId, Modo>;
