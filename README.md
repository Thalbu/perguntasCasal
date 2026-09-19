# Nós Dois — Perguntas de Casal

Jogo de perguntas para duas pessoas num celular só. Sem contas, sem
servidor: as perguntas são estáticas e o histórico mora no `localStorage`
do aparelho.

## Modos

### Modos

| Modo | Mecânica |
|---|---|
| Nós Dois | Revezam a vez, um responde por carta |
| Quem conhece melhor | Chuta a resposta do outro, com placar |
| Picante | Revezam, com três níveis de intensidade |
| Conversa profunda | Só nível 3, cruzando categorias |
| Eu ou você? | Os dois apontam numa pessoa, com contagem no fim |
| Verdade ou desafio | Perguntas com cartas de ação a cada três |
| Batalha | Adivinhação em 20 cartas |
| Respostas secretas | Cada um escreve escondido; revelam juntos |
| Noite a dois | Roteiro fechado, tema escuro forçado |

### Banco

1141 perguntas em 13 categorias, mais 61 desafios e 75 apostas do
"Eu ou você?". A **categoria** diz o que se pergunta; o **nível** (1 a 5,
de Começando a Sem filtro) diz quão fundo; o **modo** combina os dois com
uma mecânica.

Cada sessão sobe a escada de níveis: abre com três cartas do nível mais
baixo disponível e vai aprofundando. Perguntar "qual seu maior medo" de
cara trava a conversa.

No modo de adivinhação o texto usa o token `{alvo}`, trocado pelo nome de
quem está sendo adivinhado. É o que evita o "ele(a)" que deixa toda
pergunta com cara de formulário.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

## Como está montado

- `src/data/perguntas/` — um arquivo por categoria, listas por nível.
  `perguntas({ categorias, nivelMinimo, nivelMaximo })` é a única porta.
- `src/data/modos.ts` — cada modo é categorias + mecânica + faixa de nível.
- `src/lib/baralho.ts` — monta as cartas da partida. Cada mecânica tem sua
  regra de composição e o resto do jogo não precisa saber qual é.
- `src/lib/sessao.ts` — o motor: alterna a vez, conta placar, guarda a
  reserva pro botão de pular e avisa no fim.
- `src/lib/armazenamento.ts` — `localStorage` via `useSyncExternalStore`.
  Use `atualizar(fn)` e não `salvar(x)` quando a escrita vem de um callback
  memoizado, senão ela parte de um valor velho.

Dois cuidados que não se leem no código:

- o embaralhamento roda sempre dentro de um evento de clique, nunca no
  render: `Math.random` no render quebraria a hidratação;
- a pergunta do dia é derivada da data por hash, não sorteada — sem
  servidor, é assim que os dois veem a mesma sem combinar nada.

## O que não dá pra fazer sem servidor

Login, convite para o parceiro num segundo aparelho, notificações push e
geração de perguntas por IA. Num celular só, quase nada disso faz falta:
as respostas secretas funcionam melhor passando o aparelho, e a pergunta
do dia sai da data.

## Instalar no celular

É uma PWA. No Android o Chrome oferece instalar sozinho; no iOS é
Compartilhar → Adicionar à Tela de Início, porque o Safari nunca
implementou o convite automático. Depois de instalado abre em tela cheia e
funciona offline — o service worker em `public/sw.js` guarda o que já foi
visitado.

## Deploy

Estático de ponta a ponta, com deploy automático na Vercel a cada push na
`develop`. Nenhuma variável de ambiente é necessária.
