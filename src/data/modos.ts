import type { Trecho } from "@/lib/baralho";
import type { CategoriaId, Nivel } from "./tipos";

/**
 * Como se joga. A categoria diz *o que* se pergunta; a mecânica diz o que
 * acontece na tela.
 *
 * - revezar: um responde por vez, sem pontuação
 * - adivinhar: chuta a resposta do outro, com placar
 * - escolher: os dois apontam pra uma das duas pessoas
 * - roteiro: sequência fixa montada pelo app
 */
export type Mecanica = "revezar" | "adivinhar" | "escolher" | "roteiro";

export type ModoId =
  | "nos-dois"
  | "adivinhar"
  | "picante"
  | "profunda"
  | "eu-ou-voce"
  | "verdade-ou-desafio"
  | "batalha"
  | "noite";

export type Modo = {
  id: ModoId;
  nome: string;
  tagline: string;
  emoji: string;
  mecanica: Mecanica;
  categorias: CategoriaId[];
  /** Quando presente, o jogador escolhe a intensidade antes de começar. */
  niveis?: { min: Nivel; max: Nivel; padrao: Nivel };
  /**
   * Renomeia níveis dentro deste modo. O nível 3 é "Profundo" no geral, mas
   * dentro do Picante ele é flerte — o rótulo global mentiria.
   */
  rotulos?: Partial<Record<Nivel, { rotulo: string; descricao: string; emoji: string }>>;
  /** Trava o intervalo de níveis sem perguntar nada ao jogador. */
  faixa?: { min?: Nivel; max?: Nivel };
  /** Cartas por partida. Padrão 12. */
  tamanho?: number;
  /** Intercala desafios entre as perguntas. */
  misturaDesafios?: true;
  /** Sequência fixa, usada pela Noite a Dois. */
  roteiro?: Trecho[];
  /** Uma frase de fechamento, mostrada na tela final. */
  despedida?: string;
};

const CONVERSA: CategoriaId[] = [
  "conhecer",
  "amor",
  "divertidas",
  "sonhos",
  "infancia",
  "comunicacao",
  "dinheiro",
  "morar",
  "casamento",
  "familia",
  "viagens",
];

export const MODOS: Modo[] = [
  {
    id: "nos-dois",
    nome: "Nós Dois",
    tagline: "A pergunta aparece e cada um responde na sua vez",
    emoji: "💕",
    mecanica: "revezar",
    categorias: CONVERSA,
    faixa: { max: 3 },
  },
  {
    id: "adivinhar",
    nome: "Quem conhece melhor",
    tagline: "Chute a resposta do outro e some pontos",
    emoji: "🧠",
    mecanica: "adivinhar",
    categorias: ["adivinhar"],
  },
  {
    id: "picante",
    nome: "Picante",
    tagline: "Você escolhe até onde vai",
    emoji: "🔥",
    mecanica: "revezar",
    categorias: ["picante"],
    niveis: { min: 3, max: 5, padrao: 4 },
    rotulos: {
      3: { rotulo: "Romântico", descricao: "Flerte e provocação", emoji: "💕" },
      4: { rotulo: "Ousado", descricao: "Desejo sem rodeios", emoji: "🔥" },
      5: { rotulo: "Sem filtro", descricao: "Nada fica de fora", emoji: "🌶️" },
    },
  },
  {
    id: "profunda",
    nome: "Conversa profunda",
    tagline: "Só as que exigem tempo e verdade",
    emoji: "💭",
    mecanica: "revezar",
    categorias: ["conhecer", "amor", "comunicacao", "sonhos", "infancia", "familia", "casamento"],
    faixa: { min: 3, max: 3 },
  },
  {
    id: "eu-ou-voce",
    nome: "Eu ou você?",
    tagline: "Quem é mais ciumento? Apontem ao mesmo tempo",
    emoji: "👉",
    mecanica: "escolher",
    categorias: [],
    niveis: { min: 1, max: 4, padrao: 2 },
    rotulos: {
      1: { rotulo: "Leve", descricao: "Manias e bobagens", emoji: "🌸" },
      2: { rotulo: "Sério", descricao: "Sobre a relação", emoji: "💕" },
      4: { rotulo: "Safado", descricao: "Sem vergonha", emoji: "🔥" },
    },
  },
  {
    id: "verdade-ou-desafio",
    nome: "Verdade ou desafio",
    tagline: "Perguntas com cartas de ação no meio",
    emoji: "🎯",
    mecanica: "revezar",
    categorias: CONVERSA,
    misturaDesafios: true,
    niveis: { min: 1, max: 5, padrao: 2 },
  },
  {
    id: "batalha",
    nome: "Batalha",
    tagline: "20 perguntas, placar no fim",
    emoji: "🏆",
    mecanica: "adivinhar",
    categorias: ["adivinhar"],
    tamanho: 20,
  },
  {
    id: "noite",
    nome: "Noite a dois",
    tagline: "Um roteiro inteiro, do quebra-gelo ao fim da noite",
    emoji: "🌙",
    mecanica: "roteiro",
    categorias: CONVERSA,
    niveis: { min: 3, max: 5, padrao: 4 },
    rotulos: {
      3: { rotulo: "Sem picante", descricao: "Só conversa", emoji: "💭" },
      4: { rotulo: "Com fogo", descricao: "Termina quente", emoji: "🔥" },
      5: { rotulo: "Sem filtro", descricao: "Vai até o fim", emoji: "🌶️" },
    },
    despedida: "Antes de dormir: o que você mais gosta em nós dois?",
    roteiro: [
      { fonte: "pergunta", quantidade: 3, nivel: 1, categorias: CONVERSA },
      { fonte: "pergunta", quantidade: 3, nivel: 1, categorias: ["divertidas"] },
      { fonte: "desafio", quantidade: 1, nivel: 1 },
      { fonte: "pergunta", quantidade: 3, nivel: 3, categorias: CONVERSA },
      { fonte: "desafio", quantidade: 1, nivel: 2 },
      { fonte: "pergunta", quantidade: 3, nivel: 4, categorias: ["picante"] },
      { fonte: "desafio", quantidade: 1, nivel: 4 },
    ],
  },
];

export const MODO_POR_ID = Object.fromEntries(
  MODOS.map((m) => [m.id, m]),
) as Record<ModoId, Modo>;
