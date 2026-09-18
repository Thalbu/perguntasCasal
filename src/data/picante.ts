import type { Nivel, Pergunta } from "./tipos";

const nivel1 = [
  "Qual foi a primeira coisa que você reparou em mim?",
  "Que roupa minha te deixa sem jeito de um jeito bom?",
  "Onde você mais gosta de ser beijado?",
  "Qual foi o nosso beijo mais marcante?",
  "Você prefere provocação o dia inteiro ou surpresa na hora?",
  "Que gesto meu te desarma na hora?",
  "Qual música você colocaria pra tocar numa noite nossa?",
  "Me conta um pensamento que você teve sobre mim hoje e não falou.",
  "Prefere manhã, tarde ou madrugada? Por quê?",
  "Que apelido você gostaria que eu usasse só quando estamos sozinhos?",
  "Qual lugar da casa você acha mais interessante além do quarto?",
  "O que você faria se a gente tivesse um fim de semana inteiro sem ninguém por perto?",
  "Qual foi a mensagem mais ousada que você já quis mandar e apagou?",
  "Você gosta mais de conduzir ou de ser conduzido?",
  "Que tipo de carinho você acha subestimado?",
];

const nivel2 = [
  "Qual foi a vez que você mais me desejou e eu nem percebi?",
  "Tem alguma fantasia sua que você nunca me contou?",
  "O que você gostaria que eu fizesse mais vezes?",
  "Qual foi o momento mais espontâneo que a gente já teve?",
  "Você prefere devagar e demorado ou intenso e sem paciência?",
  "Tem alguma coisa que você quis pedir e travou na hora?",
  "Qual é o seu limite favorito de ser testado?",
  "O que te excita que não tem nada a ver com o corpo?",
  "Se você pudesse escolher exatamente como seria hoje à noite, como seria?",
  "Qual palavra dita no seu ouvido te desmonta?",
  "Tem algum lugar onde você sempre quis tentar?",
  "O que você acha mais sexy em mim que eu provavelmente subestimo?",
  "Qual foi a vez que você mais se soltou comigo?",
  "Você gostaria de combinar alguma regra nossa pra deixar as coisas mais interessantes?",
  "O que você gostaria de me ver fazendo agora?",
];

const nivel3 = [
  "Qual desejo seu você acha que eu talvez ache demais?",
  "Tem algo que você quer experimentar e nunca falou em voz alta?",
  "O que você mudaria na nossa intimidade se não existisse vergonha nenhuma?",
  "Qual cenário você mais imagina quando pensa na gente?",
  "Tem alguma coisa que te deixa curioso e ao mesmo tempo com receio?",
  "Qual é a coisa mais ousada que você já fez na vida?",
  "O que você gostaria de tentar comigo nos próximos meses?",
  "Existe algum limite seu que mudou desde que a gente começou?",
  "Que pedido você faria agora se eu prometesse dizer sim?",
  "Qual foi o momento mais intenso que a gente já viveu, sem filtro?",
  "Tem alguma coisa que você faz sozinho e gostaria de dividir comigo?",
  "O que te faz perder completamente o controle?",
  "Qual é o seu maior tabu e por que ele existe pra você?",
  "Se a gente combinasse uma noite sem nenhum 'não', o que você proporia?",
  "O que você quer que eu saiba sobre o seu desejo e nunca soube como explicar?",
];

const bloco = (textos: string[], nivel: Nivel, prefixo: string): Pergunta[] =>
  textos.map((texto, i) => ({ id: `${prefixo}-${i + 1}`, texto, nivel }));

export const picante: Pergunta[] = [
  ...bloco(nivel1, 1, "pi1"),
  ...bloco(nivel2, 2, "pi2"),
  ...bloco(nivel3, 3, "pi3"),
];

export const NIVEIS: { valor: Nivel; rotulo: string; descricao: string }[] = [
  { valor: 1, rotulo: "Leve", descricao: "Provocação e flerte" },
  { valor: 2, rotulo: "Quente", descricao: "Desejo sem rodeios" },
  { valor: 3, rotulo: "Sem freio", descricao: "Nada fica de fora" },
];
