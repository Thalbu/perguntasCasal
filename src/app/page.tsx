"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Botao } from "@/components/Botao";
import { BotaoTema } from "@/components/BotaoTema";
import { CampoNome } from "@/components/CampoNome";
import { CardModo } from "@/components/CardModo";
import { Estatisticas } from "@/components/Estatisticas";
import { Favoritas } from "@/components/Favoritas";
import { Historico } from "@/components/Historico";
import { Memorias } from "@/components/Memorias";
import { PerguntaDoDia } from "@/components/PerguntaDoDia";
import { MODOS } from "@/data";
import { useCasal } from "@/lib/armazenamento";

export default function Home() {
  const { valor: casal, salvar, pronto } = useCasal();
  const [rascunho, setRascunho] = useState({ a: "", b: "" });
  const nomeado = Boolean(casal.a && casal.b);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-5 py-10">
      <div className="flex items-center justify-end gap-2">
        <Link
          href="/nos"
          className="flex min-h-11 items-center rounded-full bg-white/20 px-4 text-sm text-white ring-1 ring-white/35 backdrop-blur transition hover:bg-white/30"
        >
          Nosso espaço
        </Link>
        <BotaoTema />
      </div>

      <header className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl leading-tight text-white drop-shadow-[0_4px_16px_rgba(122,34,51,0.45)]"
        >
          Nós Dois
        </motion.h1>
        <p className="mt-2 text-white/85">
          {nomeado
            ? `${casal.a} e ${casal.b}, escolham por onde começar.`
            : "Um celular, duas pessoas e perguntas que ninguém faz."}
        </p>
      </header>

      {!pronto ? null : nomeado ? (
        <>
          <PerguntaDoDia />

          <div className="flex flex-col gap-3">
            {MODOS.map((modo, i) => (
              <CardModo key={modo.id} modo={modo} indice={i} />
            ))}
          </div>
          <Estatisticas />
          <Memorias />
          <Favoritas />
          <Historico />
          <Botao
            variante="fantasma"
            className="self-center"
            onClick={() => {
              setRascunho(casal);
              salvar({ a: "", b: "" });
            }}
          >
            Trocar os nomes
          </Botao>
        </>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            salvar({ a: rascunho.a.trim(), b: rascunho.b.trim() });
          }}
        >
          <CampoNome
            rotulo="Quem começa"
            exemplo="Tainan"
            valor={rascunho.a}
            onChange={(a) => setRascunho((r) => ({ ...r, a }))}
          />
          <CampoNome
            rotulo="E o amor"
            exemplo="Dâmaris"
            valor={rascunho.b}
            onChange={(b) => setRascunho((r) => ({ ...r, b }))}
          />
          <Botao
            type="submit"
            disabled={!rascunho.a.trim() || !rascunho.b.trim()}
            className="mt-2"
          >
            Começar
          </Botao>
        </form>
      )}
    </main>
  );
}
