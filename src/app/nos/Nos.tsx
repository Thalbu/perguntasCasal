"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao } from "@/components/Botao";
import { CATEGORIAS, NIVEIS, type CategoriaId, type Nivel } from "@/data";
import { useCasal } from "@/lib/armazenamento";
import { useMinhas } from "@/lib/minhas";
import { diasJuntos, usePerfil } from "@/lib/perfil";

const campoBase =
  "mt-1 min-h-12 w-full rounded-2xl bg-white/90 px-4 text-carvao placeholder:text-carvao/35 focus:outline-2 focus:outline-offset-2 focus:outline-white";

export function Nos() {
  const { valor: casal } = useCasal();
  const { perfil, definir, pronto } = usePerfil();
  const dias = diasJuntos(perfil.desdeQuando);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <Link
        href="/"
        className="text-sm font-medium text-white/85 underline-offset-4 hover:underline"
      >
        ← Voltar
      </Link>

      <header className="text-center">
        <h1 className="font-display text-4xl text-white drop-shadow-lg">
          {perfil.apelidoDoCasal || `${casal.a || "Você"} & ${casal.b || "Amor"}`}
        </h1>
        {dias !== null && (
          <p className="mt-1 text-white/85">
            {dias.toLocaleString("pt-BR")} dias juntos
          </p>
        )}
      </header>

      {pronto && (
        <section className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
          <label className="block text-sm text-white/90">
            Desde quando
            <input
              type="date"
              value={perfil.desdeQuando}
              onChange={(e) => definir("desdeQuando", e.target.value)}
              className={campoBase}
            />
          </label>
          <label className="block text-sm text-white/90">
            Apelido do casal
            <input
              value={perfil.apelidoDoCasal}
              onChange={(e) => definir("apelidoDoCasal", e.target.value)}
              maxLength={40}
              placeholder="Como vocês se chamam"
              className={campoBase}
            />
          </label>
          <label className="block text-sm text-white/90">
            Nossa música
            <input
              value={perfil.nossaMusica}
              onChange={(e) => definir("nossaMusica", e.target.value)}
              maxLength={80}
              placeholder="Aquela música"
              className={campoBase}
            />
          </label>
          <label className="block text-sm text-white/90">
            Primeiro encontro
            <input
              value={perfil.primeiroEncontro}
              onChange={(e) => definir("primeiroEncontro", e.target.value)}
              maxLength={80}
              placeholder="Onde foi"
              className={campoBase}
            />
          </label>
        </section>
      )}

      <NossasPerguntas />
    </main>
  );
}

function NossasPerguntas() {
  const { minhas, adicionar, remover, pronto } = useMinhas();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<CategoriaId>("amor");
  const [nivel, setNivel] = useState<Nivel>(2);

  // as de adivinhação usam {alvo} e teriam que ser escritas sobre o outro
  const opcoes = CATEGORIAS.filter((c) => !c.sobreOutro);

  return (
    <section className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">Perguntas de vocês</h2>
      <p className="-mt-2 text-xs text-white/70">
        Entram no sorteio junto com as do app.
      </p>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!texto.trim()) return;
          adicionar(texto, categoria, nivel);
          setTexto("");
        }}
      >
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={2}
          maxLength={200}
          placeholder="Qual foi o melhor momento da nossa viagem?"
          className="w-full rounded-2xl bg-white/90 p-3 text-carvao placeholder:text-carvao/35 focus:outline-2 focus:outline-offset-2 focus:outline-white"
        />

        <div className="flex gap-2">
          <label className="flex-1 text-xs text-white/85">
            Categoria
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaId)}
              className="mt-1 min-h-11 w-full rounded-xl bg-white/90 px-2 text-sm text-carvao"
            >
              {opcoes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 text-xs text-white/85">
            Profundidade
            <select
              value={nivel}
              onChange={(e) => setNivel(Number(e.target.value) as Nivel)}
              className="mt-1 min-h-11 w-full rounded-xl bg-white/90 px-2 text-sm text-carvao"
            >
              {(Object.keys(NIVEIS).map(Number) as Nivel[]).map((n) => (
                <option key={n} value={n}>
                  {NIVEIS[n].emoji} {NIVEIS[n].rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Botao type="submit" disabled={!texto.trim()}>
          Adicionar ao nosso jogo
        </Botao>
      </form>

      {pronto && minhas.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2 border-t border-white/20 pt-3">
          {minhas.map((m) => (
            <li key={m.id} className="flex items-start gap-2 text-sm text-white/90">
              <span className="flex-1">{m.texto}</span>
              <button
                onClick={() => remover(m.id)}
                aria-label={`Remover: ${m.texto}`}
                className="shrink-0 px-1 text-white/60 hover:text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
