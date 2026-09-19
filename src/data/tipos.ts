/**
 * Níveis de intensidade. A sessão abre pelos baixos e vai subindo: começar
 * uma noite com "qual seu medo sobre o nosso futuro" trava a conversa.
 */
export type Nivel = 1 | 2 | 3 | 4 | 5;

export const NIVEIS: Record<Nivel, { rotulo: string; descricao: string; emoji: string }> = {
  1: { rotulo: "Começando", descricao: "Quebra-gelo, resposta rápida", emoji: "🌸" },
  2: { rotulo: "Conexão", descricao: "Já exige prestar atenção", emoji: "💕" },
  3: { rotulo: "Profundo", descricao: "Conversa de verdade", emoji: "💭" },
  4: { rotulo: "Picante", descricao: "Desejo sem rodeios", emoji: "🔥" },
  5: { rotulo: "Sem filtro", descricao: "Nada fica de fora", emoji: "🌶️" },
};

export type CategoriaId =
  | "conhecer"
  | "amor"
  | "picante"
  | "divertidas"
  | "adivinhar"
  | "sonhos"
  | "infancia"
  | "comunicacao"
  | "dinheiro"
  | "morar"
  | "casamento"
  | "familia"
  | "viagens";

export type Pergunta = {
  id: string;
  texto: string;
  categoria: CategoriaId;
  nivel: Nivel;
};

export type Desafio = {
  id: string;
  texto: string;
  nivel: Nivel;
};

/**
 * O que aparece no card. A sessão trabalha com cartas, não com perguntas:
 * os modos novos misturam desafios e apostas na mesma sequência.
 */
export type Carta =
  | { tipo: "pergunta"; id: string; texto: string; nivel: Nivel }
  | { tipo: "desafio"; id: string; texto: string; nivel: Nivel }
  | { tipo: "aposta"; id: string; texto: string; nivel: Nivel };

export type Categoria = {
  id: CategoriaId;
  nome: string;
  emoji: string;
  descricao: string;
  /**
   * Perguntas escritas sobre a outra pessoa, usando o token {alvo}. Só estas
   * servem ao modo de adivinhação.
   */
  sobreOutro?: true;
};

export const CATEGORIAS: Categoria[] = [
  { id: "conhecer", nome: "Conhecer melhor", emoji: "💕", descricao: "Quem você é, além do que já sei" },
  { id: "amor", nome: "Amor e sentimentos", emoji: "🥰", descricao: "A gente, e o que a gente sente" },
  { id: "picante", nome: "Picante", emoji: "😏", descricao: "Desejo, química e o que não se fala" },
  { id: "divertidas", nome: "Divertidas", emoji: "😂", descricao: "Absurdas, bobas e inesperadas" },
  { id: "adivinhar", nome: "Quem conhece melhor", emoji: "🧠", descricao: "Chutar a resposta do outro", sobreOutro: true },
  { id: "sonhos", nome: "Sonhos e futuro", emoji: "💭", descricao: "Pra onde a gente está indo" },
  { id: "infancia", nome: "Infância e passado", emoji: "🧒", descricao: "De onde cada um veio" },
  { id: "comunicacao", nome: "Comunicação", emoji: "💬", descricao: "Brigar, ouvir e se entender" },
  { id: "dinheiro", nome: "Dinheiro e vida juntos", emoji: "💰", descricao: "A conversa que todo casal adia" },
  { id: "morar", nome: "Morar juntos", emoji: "🏠", descricao: "Dividir espaço sem se perder" },
  { id: "casamento", nome: "Casamento", emoji: "💍", descricao: "O que significa se comprometer" },
  { id: "familia", nome: "Família e filhos", emoji: "👨‍👩‍👧", descricao: "As famílias que temos e a que queremos" },
  { id: "viagens", nome: "Viagens", emoji: "✈️", descricao: "Estrada, mapa e o mundo lá fora" },
];

export const CATEGORIA_POR_ID = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c]),
) as Record<CategoriaId, Categoria>;

/** Monta as perguntas de uma categoria a partir de listas por nível. */
export function criar(
  categoria: CategoriaId,
  prefixo: string,
  porNivel: Partial<Record<Nivel, string[]>>,
): Pergunta[] {
  return (Object.entries(porNivel) as [string, string[]][]).flatMap(
    ([nivel, textos]) =>
      textos.map((texto, i) => ({
        id: `${prefixo}${nivel}-${i + 1}`,
        texto,
        categoria,
        nivel: Number(nivel) as Nivel,
      })),
  );
}
