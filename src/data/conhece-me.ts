import type { Pergunta } from "./tipos";

/**
 * Perguntas sobre o OUTRO: quem está jogando tenta adivinhar a resposta
 * do parceiro, que depois confirma se acertou.
 */
const textos = [
  "Qual é o maior medo dele(a)?",
  "Que comida ele(a) escolheria se só pudesse comer uma pelo resto da vida?",
  "Qual foi o melhor dia da vida dele(a)?",
  "Que música ele(a) canta sem perceber?",
  "Qual defeito ele(a) mais admite ter?",
  "Se ele(a) ganhasse um dia livre sozinho(a), o que faria?",
  "Qual é a maior mania dele(a)?",
  "Que série ou filme ele(a) reassistiria pela décima vez?",
  "Qual elogio deixa ele(a) mais sem graça?",
  "Que lugar ele(a) mais quer conhecer?",
  "Qual é o prato preferido dele(a) da infância?",
  "O que mais irrita ele(a) no trânsito?",
  "Qual foi a última coisa que fez ele(a) rir muito?",
  "Que tipo de presente ele(a) realmente gosta de ganhar?",
  "Qual é a bebida preferida dele(a)?",
  "O que ele(a) faz primeiro quando acorda?",
  "Qual é o maior sonho profissional dele(a)?",
  "Que pessoa da família dele(a) é a mais parecida com ele(a)?",
  "Qual é o apelido de infância dele(a)?",
  "O que ele(a) faz quando está estressado(a)?",
  "Qual esporte ou atividade física ele(a) toparia fazer comigo?",
  "Qual é a rede social que ele(a) mais perde tempo?",
  "Que coisa ele(a) adia sempre?",
  "Qual foi o professor mais marcante dele(a)?",
  "O que ele(a) acha o pior tipo de fila?",
  "Qual é a maior vergonha que ele(a) já passou?",
  "Que animal ele(a) escolheria ter?",
  "Qual é o gosto musical mais inesperado dele(a)?",
  "O que ele(a) mais gosta em mim fisicamente?",
  "Qual característica minha ele(a) acha mais irritante?",
  "Que época do ano ele(a) mais gosta e por quê?",
  "Qual foi o maior mico que ele(a) já contou pra mim?",
  "O que ele(a) escolheria: praia ou montanha?",
  "Qual é o filme que faz ele(a) chorar?",
  "Que promessa ele(a) me fez e cumpriu sem eu pedir?",
  "Qual é o cheiro preferido dele(a)?",
  "O que ele(a) gostaria de mudar na rotina da gente?",
  "Qual é a maior qualidade que ele(a) enxerga em si mesmo(a)?",
  "Que decisão ele(a) está adiando agora?",
  "Qual foi a primeira impressão que ele(a) teve de mim?",
];

export const conheceMe: Pergunta[] = textos.map((texto, i) => ({
  id: `cm-${i + 1}`,
  texto,
}));
