import type { Desafio, Nivel } from "./tipos";

/**
 * Cartas de ação, não de pergunta. Entram no "Verdade ou Desafio" e no
 * roteiro da Noite a Dois — é o que tira o app do formato de quiz.
 */
const porNivel: Partial<Record<Nivel, string[]>> = {
  1: [
    "Deem um abraço de trinta segundos, sem falar nada.",
    "Imite o outro por trinta segundos.",
    "Tirem uma foto fazendo a mesma careta.",
    "Diga três coisas que você ama no outro, olhando nos olhos.",
    "Fiquem trinta segundos se olhando sem rir.",
    "Conte uma lembrança nossa que você nunca contou.",
    "Mostre a última foto do seu celular e explique.",
    "Leia em voz alta a primeira mensagem que a gente trocou.",
    "Descreva o outro em três palavras e justifique cada uma.",
    "Faça um elogio que você nunca fez.",
    "Cante um pedaço da nossa música.",
    "Dance trinta segundos sem música.",
    "Conte a história do nosso primeiro encontro do seu jeito.",
    "Desenhe o rosto do outro em trinta segundos e mostre.",
    "Diga em voz alta uma coisa que você agradece hoje.",
    "Escolha uma música que combina com o outro e toque agora.",
    "Faça uma massagem de um minuto nos ombros do outro.",
    "Conte a coisa mais engraçada que aconteceu com você esta semana.",
    "Imite como o outro acorda de manhã.",
    "Diga o que você mais gostou no dia de hoje.",
  ],
  2: [
    "Escreva num papel uma coisa que você ama no outro e entregue.",
    "Diga uma coisa que você admira e nunca falou em voz alta.",
    "Peça desculpa por algo pequeno que ficou pendente.",
    "Conte um medo seu que o outro ainda não conhece.",
    "Faça um pedido que você vem adiando.",
    "Diga uma coisa que você precisa mais do outro.",
    "Conte um momento em que você se sentiu muito amado.",
    "Prometa uma coisa pequena pra esta semana e cumpra.",
    "Diga o que você faria diferente na semana que passou.",
    "Conte uma coisa que te deixou inseguro recentemente.",
    "Fale de um sonho seu e peça ajuda com um passo dele.",
    "Diga uma coisa que o outro faz e você nunca agradeceu.",
    "Conte um momento em que você teve orgulho do outro.",
    "Combine agora um programa pros próximos quinze dias.",
    "Diga uma coisa que você quer mudar em você.",
  ],
  3: [
    "Conte uma coisa que você guardou por medo da reação.",
    "Diga o que mais te machucou numa briga nossa.",
    "Peça desculpa por algo que nunca foi resolvido.",
    "Conte um arrependimento que você carrega.",
    "Diga em que você sente que está falhando comigo.",
    "Fale de uma coisa que você precisa e tem vergonha de pedir.",
    "Conte o que te dá mais medo sobre o nosso futuro.",
    "Diga uma verdade difícil, com cuidado.",
    "Escute o outro por dois minutos sem interromper nem responder.",
    "Diga o que você faria se tivesse mais coragem na nossa relação.",
  ],
  4: [
    "Beije o outro onde ele mais gosta.",
    "Sussurre no ouvido do outro o que você está pensando agora.",
    "Diga em voz alta o que você achou mais atraente hoje.",
    "Faça a provocação que sempre funciona.",
    "Tire uma peça de roupa por escolha do outro.",
    "Faça uma massagem de dois minutos onde o outro pedir.",
    "Descreva o melhor momento nosso em detalhe.",
    "Diga um desejo que você nunca falou.",
    "Beije o outro por trinta segundos sem usar as mãos.",
    "Escolha a música e dance pro outro por um minuto.",
  ],
  5: [
    "Conte a fantasia que você nunca teve coragem de dizer.",
    "Peça agora o que você quer, sem rodeio.",
    "Diga um limite seu e um limite que você quer testar.",
    "Deixe o outro decidir os próximos dez minutos.",
    "Conte o que te deu mais prazer na nossa história.",
    "Diga o que você quer que aconteça quando esse jogo acabar.",
  ],
};

export const desafios: Desafio[] = (
  Object.entries(porNivel) as [string, string[]][]
).flatMap(([nivel, textos]) =>
  textos.map((texto, i) => ({
    id: `de${nivel}-${i + 1}`,
    texto,
    nivel: Number(nivel) as Nivel,
  })),
);
