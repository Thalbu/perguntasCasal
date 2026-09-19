"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Botao } from "@/components/Botao";
import { CardPergunta } from "@/components/CardPergunta";
import { Confete } from "@/components/Confete";
import { Progresso } from "@/components/Progresso";
import { NIVEIS, perguntas, type Modo, type Nivel } from "@/data";
import { useCasal } from "@/lib/armazenamento";
import { useHistorico } from "@/lib/historico";
import { PERGUNTAS_POR_SESSAO, useSessao } from "@/lib/sessao";

export function Jogo({ modo }: { modo: Modo }) {
  const { valor: casal, pronto } = useCasal();
  const [nivel, setNivel] = useState<Nivel>(modo.niveis?.padrao ?? 3);

  /** Modos de adivinhação pontuam; os de conversa, não. */
  const pontua = modo.mecanica === "adivinhar";

  const banco = useCallback(
    (nivelMaximo?: number) =>
      perguntas({
        categorias: modo.categorias,
        nivelMinimo: modo.faixa?.min,
        nivelMaximo: (nivelMaximo as Nivel | undefined) ?? modo.faixa?.max,
      }),
    [modo.categorias, modo.faixa?.min, modo.faixa?.max],
  );

  const { registrar } = useHistorico();
  const aoTerminar = useCallback(
    (placar: [number, number], total: number) =>
      registrar({
        quando: new Date().toISOString(),
        modo: modo.id,
        perguntas: total,
        placar: pontua ? placar : undefined,
      }),
    [registrar, modo.id, pontua],
  );

  const sessao = useSessao(banco, aoTerminar);
  const nomes: [string, string] = [casal.a || "Você", casal.b || "Amor"];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-white/85 underline-offset-4 hover:underline"
        >
          ← Voltar
        </Link>
        {sessao.fase === "jogando" && (
          <span className="ml-auto text-sm text-white/85">
            {sessao.indice + 1} de {sessao.total}
          </span>
        )}
      </div>

      {sessao.fase === "jogando" && (
        <Progresso atual={sessao.indice} total={sessao.total} />
      )}

      {sessao.fase === "intro" && (
        <Intro
          modo={modo}
          nivel={nivel}
          setNivel={setNivel}
          pronto={pronto}
          onComecar={() =>
            sessao.comecar(modo.niveis ? { nivelMaximo: nivel } : undefined)
          }
        />
      )}

      <AnimatePresence mode="wait">
        {sessao.fase === "jogando" && sessao.atual && (
          <Rodada
            key={sessao.atual.pergunta.id}
            texto={sessao.atual.pergunta.texto.replaceAll(
              "{alvo}",
              nomes[sessao.atual.vez === 0 ? 1 : 0],
            )}
            quem={nomes[sessao.atual.vez]}
            sobre={nomes[sessao.atual.vez === 0 ? 1 : 0]}
            pontua={pontua}
            onAvancar={sessao.avancar}
          />
        )}
      </AnimatePresence>

      {sessao.fase === "fim" && (
        <Fim
          pontua={pontua}
          nomes={nomes}
          placar={sessao.placar}
          total={sessao.total}
          onDeNovo={sessao.reiniciar}
        />
      )}
    </main>
  );
}

function Intro({
  modo,
  nivel,
  setNivel,
  pronto,
  onComecar,
}: {
  modo: Modo;
  nivel: Nivel;
  setNivel: (n: Nivel) => void;
  pronto: boolean;
  onComecar: () => void;
}) {
  const faixa = modo.niveis;
  const opcoes = faixa
    ? (Object.keys(NIVEIS)
        .map(Number)
        .filter((n) => n >= faixa.min && n <= faixa.max) as Nivel[])
    : [];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <span aria-hidden className="text-6xl">
        {modo.emoji}
      </span>
      <div>
        <h1 className="font-display text-4xl text-white drop-shadow-lg">{modo.nome}</h1>
        <p className="mt-2 text-white/85">{modo.tagline}</p>
        <p className="mt-1 text-sm text-white/70">
          {PERGUNTAS_POR_SESSAO} perguntas, revezando entre vocês.
        </p>
      </div>

      {opcoes.length > 0 && (
        <fieldset className="w-full">
          <legend className="mb-2 text-sm font-medium text-white/90">
            Até onde vocês querem ir?
          </legend>
          <div className="flex gap-2">
            {opcoes.map((n) => {
              const rot = modo.rotulos?.[n] ?? NIVEIS[n];
              return (
              <button
                key={n}
                type="button"
                onClick={() => setNivel(n)}
                aria-pressed={nivel === n}
                className={`min-h-18 flex-1 rounded-2xl px-2 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white ${
                  nivel === n
                    ? "bg-creme text-vinho shadow-lg"
                    : "bg-white/20 text-white ring-1 ring-white/40"
                }`}
              >
                <span aria-hidden className="block text-lg">
                  {rot.emoji}
                </span>
                <span className="block font-semibold">{rot.rotulo}</span>
                <span className="block text-xs opacity-80">{rot.descricao}</span>
              </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <Botao onClick={onComecar} disabled={!pronto}>
        Começar
      </Botao>
    </div>
  );
}

function Rodada({
  texto,
  quem,
  sobre,
  pontua,
  onAvancar,
}: {
  texto: string;
  quem: string;
  sobre: string;
  pontua: boolean;
  onAvancar: (acertou?: boolean) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [comemorando, setComemorando] = useState(false);

  // deixa o confete respirar antes de trocar a pergunta
  const acertou = () => {
    setComemorando(true);
    setTimeout(() => onAvancar(true), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 64 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -64 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="flex flex-1 flex-col justify-center gap-6"
    >
      {/* redundante enquanto o verso do card já anuncia de quem é a vez */}
      <p className="min-h-5 text-center text-sm font-medium tracking-wide text-white/90 uppercase">
        {aberto && (pontua ? `${quem} chuta por ${sobre}` : `Vez de ${quem}`)}
      </p>

      <div className="relative">
        {comemorando && <Confete semente={texto} />}
        <CardPergunta
          texto={texto}
          chamada={quem}
          dica={pontua ? `o que ${sobre} responderia?` : "sua vez"}
          aberto={aberto}
          onAbrir={() => setAberto(true)}
        />
      </div>

      {aberto &&
        (pontua ? (
          <div className="flex gap-3">
            <Botao
              variante="fantasma"
              className="flex-1"
              disabled={comemorando}
              onClick={() => onAvancar(false)}
            >
              Errou
            </Botao>
            <Botao className="flex-1" disabled={comemorando} onClick={acertou}>
              Acertou
            </Botao>
          </div>
        ) : (
          <Botao className="self-center" onClick={() => onAvancar()}>
            Próxima
          </Botao>
        ))}
    </motion.div>
  );
}

function Fim({
  pontua,
  nomes,
  placar,
  total,
  onDeNovo,
}: {
  pontua: boolean;
  nomes: [string, string];
  placar: [number, number];
  total: number;
  onDeNovo: () => void;
}) {
  const [a, b] = placar;
  const veredito = !pontua
    ? "Doze perguntas a menos entre vocês."
    : a === b
      ? `Empate: ${a} a ${b}. Vocês se conhecem igual.`
      : `${a > b ? nomes[0] : nomes[1]} conhece melhor.`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <h2 className="font-display text-4xl text-white drop-shadow-lg">Acabou por hoje</h2>
      <p className="-mt-3 text-white/85">{veredito}</p>

      {pontua && (
        <div className="flex w-full gap-3">
          {nomes.map((nome, i) => (
            <div
              key={nome + i}
              className={`flex-1 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] ${
                placar[i] === Math.max(a, b) && a !== b
                  ? "bg-creme ring-3 ring-white"
                  : "bg-creme/85"
              }`}
            >
              <p className="truncate text-sm text-carvao/70">{nome}</p>
              <p className="font-display text-4xl text-vinho">
                {placar[i]}
                <span className="text-lg text-carvao/45">/{Math.ceil(total / 2)}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <Botao onClick={onDeNovo}>Jogar de novo</Botao>
        <Link href="/" className="text-white/85 underline underline-offset-4">
          Escolher outro modo
        </Link>
      </div>
    </div>
  );
}
