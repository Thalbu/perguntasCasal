import type { Metadata } from "next";
import { Nos } from "./Nos";

export const metadata: Metadata = { title: "Nosso espaço" };

export default function PaginaNos() {
  return <Nos />;
}
