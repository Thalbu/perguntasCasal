# Nós Dois — Perguntas de Casal

Jogo de perguntas para duas pessoas num celular só. Sem contas, sem
servidor: as perguntas são estáticas e o histórico mora no `localStorage`
do aparelho.

## Modos

| Modo | Perguntas | O que é |
|---|---|---|
| Conhecer Melhor | 363 | A pessoa, a história dela e a nossa, mais rotina e futuro |
| Picante | 221 | Três níveis de ousadia, escolhidos antes de começar |
| Você Me Conhece? | 222 | Adivinhar a resposta do outro, com placar de acertos |

806 no total. Cada sessão sorteia 12 sem repetir, abrindo com três
quebra-gelos (`leve: true`) antes de ir fundo — perguntar "qual seu maior
medo" de cara trava a conversa.

No "Você Me Conhece?" o texto usa o token `{alvo}`, trocado pelo nome de
quem está sendo adivinhado no momento de renderizar. É o que evita o
"ele(a)" que deixa toda pergunta com cara de formulário.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

## Como está montado

- `src/data/` — banco de perguntas e o catálogo de modos. Um arquivo por
  modo; `perguntasDo(modo, nivelMaximo)` é a única porta de acesso.
- `src/lib/sessao.ts` — o motor: sorteia, alterna a vez, conta placar e
  avisa no fim. Os três modos rodam em cima dele.
- `src/lib/armazenamento.ts` — `localStorage` via `useSyncExternalStore`.
  Use `atualizar(fn)` e não `salvar(x)` quando a escrita vem de um callback
  memoizado, senão ela parte de um valor velho.
- `src/app/jogar/[modo]/` — rota estática, uma por modo.

O embaralhamento roda sempre dentro de um evento de clique, nunca no
render: `Math.random` no render quebraria a hidratação.

## Deploy

Estático de ponta a ponta. Na Vercel é importar o repositório e aceitar os
padrões — nenhuma variável de ambiente é necessária.
