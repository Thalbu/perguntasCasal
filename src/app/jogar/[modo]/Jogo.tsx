"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Botao } from "@/components/Botao";
import { CardPergunta } from "@/components/CardPergunta";
import { Confete } from "@/components/Confete";
import { Progresso } from "@/components/Progresso";
import { NIVEIS, type Carta, type Modo, type Nivel } from "@/data";
import { useCasal } from "@/lib/armazenamento";
import { useFavoritas } from "@/lib/favoritas";
import { useHistorico } from "@/lib/historico";
import { useSessao, type Resultado } from "@/lib/sessao";
import { useTema } from "@/lib/tema";
import { useVistas } from "@/lib/vistas";

export function Jogo({ modo }: { modo: Modo }) {
  const { valor: casal, pronto } = useCasal();
  const [nivel, setNivel] = useState<Nivel>(modo.niveis?.padrao ?? 3);

  const pontua = modo.mecanica === "adivinhar";
  const aponta = modo.mecanica === "escolher";

  const { registrar } = useHistorico();
  const { vistas, marcar } = useVistas();
  const { favoritas, alternar } = useFavoritas();

  // Set recriado a cada render é barato e evita guardar estado duplicado
  const jaVistas = new Set(vistas);

  const aoTerminar = useCallback(
    (r: Resultado, total: number) =>
      registrar({
        quando: new Date().toISOString(),
        modo: modo.id,
        perguntas: total,
        placar: pontua ? r.placar : undefined,
      }),
    [registrar, modo.id, pontua],
  );

  const sessao = useSessao(modo, jaVistas, aoTerminar);

  // A Noite a dois é escura por definição; ao sair, o tema do casal volta.
  const { tema, aplicar } = useTema();
  useEffect(() => {
    if (!modo.cinematografico) return;
    aplicar("escuro");
    return () => aplicar(tema);
  }, [modo.cinematografico, aplicar, tema]);
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
          onComecar={() => sessao.comecar(modo.niveis ? nivel : undefined)}
        />
      )}

      <AnimatePresence mode="wait">
        {sessao.fase === "jogando" && sessao.atual && (
          <Rodada
            key={sessao.atual.carta.id}
            carta={sessao.atual.carta}
            quem={nomes[sessao.atual.vez]}
            sobre={nomes[sessao.atual.vez === 0 ? 1 : 0]}
            nomes={nomes}
            pontua={pontua}
            favoritada={favoritas.some((f) => f.id === sessao.atual!.carta.id)}
            onFavoritar={alternar}
            onPular={sessao.podePular ? sessao.pular : undefined}
            onAvancar={(r) => {
              marcar([sessao.atual!.carta.id]);
              sessao.avancar(r);
            }}
          />
        )}
      </AnimatePresence>

      {sessao.fase === "fim" && (
        <Fim
          modo={modo}
          pontua={pontua}
          aponta={aponta}
          nomes={nomes}
          placar={sessao.placar}
          apontamentos={sessao.apontamentos}
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
        .filter(
          (n) => n >= faixa.min && n <= faixa.max && (modo.rotulos?.[n as Nivel] || !modo.rotulos),
        ) as Nivel[])
    : [];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <span aria-hidden className="text-6xl">
        {modo.emoji}
      </span>
      <div>
        <h1 className="font-display text-4xl text-white drop-shadow-lg">{modo.nome}</h1>
        <p className="mt-2 text-white/85">{modo.tagline}</p>
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

type Registro = { acertou?: boolean; apontado?: 0 | 1 };

function Rodada({
  carta,
  quem,
  sobre,
  nomes,
  pontua,
  favoritada,
  onFavoritar,
  onPular,
  onAvancar,
}: {
  carta: Carta;
  quem: string;
  sobre: string;
  nomes: [string, string];
  pontua: boolean;
  favoritada: boolean;
  onFavoritar: (c: { id: string; texto: string }) => void;
  onPular?: () => void;
  onAvancar: (r?: Registro) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [comemorando, setComemorando] = useState(false);

  const desafio = carta.tipo === "desafio";
  const texto = carta.texto.replaceAll("{alvo}", sobre);

  // deixa o confete respirar antes de trocar a carta
  const acertou = () => {
    setComemorando(true);
    setTimeout(() => onAvancar({ acertou: true }), 700);
  };

  const etiqueta = desafio
    ? "Desafio"
    : carta.tipo === "aposta"
      ? "Os dois apontam ao mesmo tempo"
      : pontua
        ? `${quem} chuta por ${sobre}`
        : `Vez de ${quem}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 64 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -64 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="flex flex-1 flex-col justify-center gap-6"
    >
      <p className="min-h-5 text-center text-sm font-medium tracking-wide text-white/90 uppercase">
        {aberto && etiqueta}
      </p>

      <div className="relative">
        {comemorando && <Confete semente={carta.id} />}
        <CardPergunta
          texto={texto}
          chamada={desafio ? "Desafio" : carta.tipo === "aposta" ? "Eu ou você?" : quem}
          dica={
            desafio
              ? "toque pra ver"
              : carta.tipo === "aposta"
                ? "apontem juntos"
                : pontua
                  ? `o que ${sobre} responderia?`
                  : "sua vez"
          }
          aberto={aberto}
          onAbrir={() => setAberto(true)}
          variante={desafio ? "desafio" : "pergunta"}
        />
      </div>

      {aberto && (
        <div className="flex justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => onFavoritar({ id: carta.id, texto })}
            aria-pressed={favoritada}
            className="min-h-11 px-2 text-white/85 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {favoritada ? "♥ Guardada" : "♡ Guardar"}
          </button>
          {onPular && (
            <button
              type="button"
              onClick={onPular}
              className="min-h-11 px-2 text-white/85 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Pular essa
            </button>
          )}
        </div>
      )}

      {aberto && (
        <>
          {carta.tipo === "aposta" && (
            <div className="flex gap-3">
              {nomes.map((nome, i) => (
                <Botao
                  key={nome + i}
                  className="flex-1 truncate"
                  onClick={() => onAvancar({ apontado: i as 0 | 1 })}
                >
                  {nome}
                </Botao>
              ))}
            </div>
          )}

          {carta.tipo !== "aposta" && pontua && (
            <div className="flex gap-3">
              <Botao
                variante="fantasma"
                className="flex-1"
                disabled={comemorando}
                onClick={() => onAvancar({ acertou: false })}
              >
                Errou
              </Botao>
              <Botao className="flex-1" disabled={comemorando} onClick={acertou}>
                Acertou
              </Botao>
            </div>
          )}

          {carta.tipo !== "aposta" && !pontua && (
            <Botao className="self-center" onClick={() => onAvancar()}>
              {desafio ? "Feito!" : "Próxima"}
            </Botao>
          )}
        </>
      )}
    </motion.div>
  );
}

function Fim({
  modo,
  pontua,
  aponta,
  nomes,
  placar,
  apontamentos,
  total,
  onDeNovo,
}: {
  modo: Modo;
  pontua: boolean;
  aponta: boolean;
  nomes: [string, string];
  placar: [number, number];
  apontamentos: [number, number];
  total: number;
  onDeNovo: () => void;
}) {
  const [a, b] = pontua ? placar : apontamentos;

  const veredito = pontua
    ? a === b
      ? `Empate: ${a} a ${b}. Vocês se conhecem igual.`
      : `${a > b ? nomes[0] : nomes[1]} conhece melhor.`
    : aponta
      ? a === b
        ? "Empate perfeito. Vocês são igualmente culpados."
        : `${a > b ? nomes[0] : nomes[1]} levou a fama da noite.`
      : `${total} cartas a menos entre vocês.`;

  const mostraPlacar = pontua || aponta;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <h2 className="font-display text-4xl text-white drop-shadow-lg">Acabou por hoje</h2>
      <p className="-mt-3 text-white/85">{veredito}</p>

      {mostraPlacar && (
        <div className="flex w-full gap-3">
          {nomes.map((nome, i) => {
            const valor = (pontua ? placar : apontamentos)[i];
            return (
              <div
                key={nome + i}
                className={`flex-1 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] ${
                  valor === Math.max(a, b) && a !== b ? "bg-creme ring-3 ring-white" : "bg-creme/85"
                }`}
              >
                <p className="truncate text-sm text-carvao/70">{nome}</p>
                <p className="font-display text-4xl text-vinho">
                  {valor}
                  {pontua && (
                    <span className="text-lg text-carvao/45">/{Math.ceil(total / 2)}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {modo.despedida && (
        <p className="rounded-[var(--radius-card)] bg-creme/95 p-6 font-display text-2xl text-vinho shadow-[var(--shadow-card)]">
          {modo.despedida}
        </p>
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
