import type { CategoriaId, Nivel } from "./tipos";

/**
 * Como se joga. A categoria diz *o que* se pergunta; a mecânica diz o que
 * acontece na tela.
 *
 * - revezar: um responde por vez, sem pontuação
 * - adivinhar: chuta a resposta do outro, com placar
 */
export type Mecanica = "revezar" | "adivinhar";

export type ModoId = "nos-dois" | "adivinhar" | "picante" | "profunda";

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
};

export const MODOS: Modo[] = [
  {
    id: "nos-dois",
    nome: "Nós Dois",
    tagline: "A pergunta aparece e cada um responde na sua vez",
    emoji: "💕",
    mecanica: "revezar",
    categorias: [
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
    ],
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
];

export const MODO_POR_ID = Object.fromEntries(
  MODOS.map((m) => [m.id, m]),
) as Record<ModoId, Modo>;
