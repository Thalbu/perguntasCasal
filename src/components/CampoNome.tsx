type Props = {
  rotulo: string;
  valor: string;
  exemplo: string;
  onChange: (v: string) => void;
};

export function CampoNome({ rotulo, valor, exemplo, onChange }: Props) {
  return (
    <label className="block text-left">
      <span className="ml-4 text-sm font-medium text-white/90">{rotulo}</span>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        maxLength={20}
        autoComplete="off"
        placeholder={exemplo}
        className="mt-1 min-h-12 w-full rounded-full bg-white/90 px-5 text-lg text-carvao placeholder:text-carvao/35 focus:outline-2 focus:outline-offset-2 focus:outline-white"
      />
    </label>
  );
}
