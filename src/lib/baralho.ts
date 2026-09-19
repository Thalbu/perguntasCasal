import {
  apostas,
  desafios,
  perguntas,
  type Carta,
  type Modo,
  type Nivel,
} from "@/data";
import { embaralhar } from "./embaralhar";
import { inedito } from "./vistas";

/** Quantas cartas do nível mais baixo abrem a sessão. */
const ABERTURA = 3;

const carta = (tipo: Carta["tipo"]) =>
  (x: { id: string; texto: string; nivel: Nivel }): Carta =>
    ({ tipo, id: x.id, texto: x.texto, nivel: x.nivel }) as Carta;

/**
 * Sobe a escada de níveis: sorteia dentro de cada nível e vai do mais baixo
 * ao mais alto. Abrir uma noite pelo nível 5 trava a conversa antes de ela
 * começar.
 */
function escada(pool: Carta[], quantidade: number): Carta[] {
  const porNivel = new Map<number, Carta[]>();
  for (const c of pool) porNivel.set(c.nivel, [...(porNivel.get(c.nivel) ?? []), c]);

  const niveis = [...porNivel.keys()].sort((a, b) => a - b);
  if (niveis.length === 0) return [];

  const todas = niveis.flatMap((n) => embaralhar(porNivel.get(n)!));
  const abertura = embaralhar(porNivel.get(niveis[0])!).slice(0, ABERTURA);
  const ids = new Set(abertura.map((c) => c.id));

  return [...abertura, ...todas.filter((c) => !ids.has(c.id))].slice(0, quantidade);
}

/** Um trecho do roteiro da Noite a Dois. */
export type Trecho = {
  fonte: "pergunta" | "desafio" | "aposta";
  quantidade: number;
  nivel?: Nivel;
  categorias?: Modo["categorias"];
};

function sortear(t: Trecho, nivelMaximo: Nivel, vistas: Set<string>): Carta[] {
  const nivel = t.nivel && t.nivel > nivelMaximo ? nivelMaximo : t.nivel;

  if (t.fonte === "desafio") {
    const pool = desafios.filter((d) => (nivel ? d.nivel === nivel : true));
    return embaralhar(inedito(pool.map(carta("desafio")), vistas, t.quantidade)).slice(
      0,
      t.quantidade,
    );
  }
  if (t.fonte === "aposta") {
    const pool = apostas.filter((a) => (nivel ? a.nivel === nivel : true));
    return embaralhar(inedito(pool.map(carta("aposta")), vistas, t.quantidade)).slice(
      0,
      t.quantidade,
    );
  }
  const pool = perguntas({
    categorias: t.categorias,
    nivelMinimo: nivel,
    nivelMaximo: nivel ?? nivelMaximo,
  });
  return embaralhar(inedito(pool.map(carta("pergunta")), vistas, t.quantidade)).slice(
    0,
    t.quantidade,
  );
}

/**
 * Monta as cartas de uma partida. Cada mecânica tem uma regra própria de
 * composição; o resto do jogo não precisa saber qual é.
 */
export function montarBaralho(
  modo: Modo,
  nivelEscolhido?: Nivel,
  vistas: Set<string> = new Set(),
  /** cartas a mais, guardadas como reserva pro botão de pular */
  extra = 6,
  /** perguntas escritas pelo casal, misturadas às do app */
  nossas: { carta: Carta; categoria: string }[] = [],
): Carta[] {
  const teto = nivelEscolhido ?? modo.faixa?.max ?? 5;
  const tamanho = (modo.tamanho ?? 12) + extra;

  /** descarta o que já saiu, a menos que sobre pouco pra montar a partida */
  const novas = (pool: Carta[], quantos: number) => inedito(pool, vistas, quantos);

  if (modo.roteiro) {
    const roteiro = modo.roteiro.flatMap((t) => sortear(t, teto, vistas));
    const usados = new Set([...vistas, ...roteiro.map((c) => c.id)]);
    // a reserva vem depois do roteiro, então pular não desmonta a sequência
    const sobra = sortear(
      { fonte: "pergunta", quantidade: extra, categorias: modo.categorias },
      teto,
      usados,
    );
    return [...roteiro, ...sobra];
  }

  if (modo.mecanica === "escolher") {
    const pool = apostas.filter((a) => a.nivel <= teto).map(carta("aposta"));
    return escada(novas(pool, tamanho), tamanho);
  }

  const doCasal = nossas
    .filter(
      (n) =>
        modo.categorias.includes(n.categoria as never) &&
        n.carta.nivel <= teto &&
        n.carta.nivel >= (modo.faixa?.min ?? 1),
    )
    .map((n) => n.carta);

  const base = [
    ...perguntas({
      categorias: modo.categorias,
      nivelMinimo: modo.faixa?.min,
      nivelMaximo: teto,
    }).map(carta("pergunta")),
    ...doCasal,
  ];

  if (!modo.misturaDesafios) return escada(novas(base, tamanho), tamanho);

  // Verdade ou Desafio: uma carta de ação a cada três perguntas
  const acoes = desafios.filter((d) => d.nivel <= teto).map(carta("desafio"));
  const alvoPerg = Math.ceil((tamanho * 2) / 3);
  const perg = escada(novas(base, alvoPerg), alvoPerg);
  const des = escada(novas(acoes, tamanho - perg.length), tamanho - perg.length);

  const misturado: Carta[] = [];
  let i = 0;
  let j = 0;
  while (misturado.length < tamanho && (i < perg.length || j < des.length)) {
    if (misturado.length % 3 === 2 && j < des.length) misturado.push(des[j++]);
    else if (i < perg.length) misturado.push(perg[i++]);
    else if (j < des.length) misturado.push(des[j++]);
    else break;
  }
  return misturado;
}
