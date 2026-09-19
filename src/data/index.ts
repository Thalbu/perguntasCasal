import { adivinhar } from "./perguntas/adivinhar";
import { amor } from "./perguntas/amor";
import { casamento } from "./perguntas/casamento";
import { comunicacao } from "./perguntas/comunicacao";
import { conhecer } from "./perguntas/conhecer";
import { dinheiro } from "./perguntas/dinheiro";
import { divertidas } from "./perguntas/divertidas";
import { familia } from "./perguntas/familia";
import { infancia } from "./perguntas/infancia";
import { morar } from "./perguntas/morar";
import { picante } from "./perguntas/picante";
import { sonhos } from "./perguntas/sonhos";
import { viagens } from "./perguntas/viagens";
import type { CategoriaId, Nivel, Pergunta } from "./tipos";

export const BANCO: Pergunta[] = [
  ...conhecer,
  ...amor,
  ...picante,
  ...divertidas,
  ...adivinhar,
  ...sonhos,
  ...infancia,
  ...comunicacao,
  ...dinheiro,
  ...morar,
  ...casamento,
  ...familia,
  ...viagens,
];

export type Filtro = {
  categorias?: CategoriaId[];
  nivelMaximo?: Nivel;
  nivelMinimo?: Nivel;
};

/** Única porta de acesso ao banco. */
export function perguntas({ categorias, nivelMaximo, nivelMinimo }: Filtro = {}) {
  return BANCO.filter(
    (p) =>
      (!categorias || categorias.includes(p.categoria)) &&
      (nivelMaximo === undefined || p.nivel <= nivelMaximo) &&
      (nivelMinimo === undefined || p.nivel >= nivelMinimo),
  );
}

export function quantasPor(categoria: CategoriaId) {
  return BANCO.filter((p) => p.categoria === categoria).length;
}

export * from "./desafios";
export * from "./modos";
export * from "./eu-ou-voce";
export * from "./tipos";
