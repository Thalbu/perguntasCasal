import { notFound } from "next/navigation";
import { MODOS, MODOS_POR_ID, type ModoId } from "@/data";
import { Jogo } from "./Jogo";

export function generateStaticParams() {
  return MODOS.map((m) => ({ modo: m.id }));
}

export default async function PaginaJogar({ params }: PageProps<"/jogar/[modo]">) {
  const { modo } = await params;
  const config = MODOS_POR_ID[modo as ModoId];
  if (!config) notFound();
  return <Jogo modo={config} />;
}
