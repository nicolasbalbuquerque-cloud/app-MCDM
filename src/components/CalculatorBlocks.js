'use client';

import Input from './ui/Input';

export function PageHeader({ metodo, titulo, descricao, formula }) {
  return (
    <header className="border-b border-slate-800 pb-6 space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-500">Calculadora multicritério</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-teal-400">{titulo || metodo}</h1>
      <p className="text-slate-400 max-w-5xl leading-relaxed">{descricao}</p>
      {formula && (
        <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-mono text-cyan-300">
          {formula}
        </div>
      )}
    </header>
  );
}

export function StepCard({ numero, titulo, subtitulo, children }) {
  return (
    <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-slate-950 font-extrabold">{numero}</span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-100">{titulo}</h2>
          {subtitulo && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{subtitulo}</p>}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function PesoTipoGrid({ nomesCrit = [], pesos = [], tipos = [], onPeso, onTipo, descricaoPeso = 'Peso bruto' }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {nomesCrit.map((nome, j) => (
        <div key={j} className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-teal-400 block mb-3">{nome}</span>
          <Input label={descricaoPeso} type="number" step="0.01" value={pesos[j] ?? ''} onChange={(e) => onPeso(j, e.target.value)} />
          <button
            type="button"
            onClick={() => onTipo(j)}
            className={`mt-3 w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${tipos[j] === 'beneficio' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'}`}
          >
            Sentido: {tipos[j] === 'beneficio' ? 'benefício' : 'custo'}
          </button>
        </div>
      ))}
    </div>
  );
}

export function ActionBar({ onExample, onCalculate, calculateLabel = 'Calcular ranking' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {onExample && (
        <button type="button" onClick={onExample} className="px-6 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:border-teal-600 text-slate-200 font-bold transition-all">
          Carregar exemplo testável
        </button>
      )}
      <button type="button" onClick={onCalculate} className="px-8 py-4 bg-teal-600 hover:bg-teal-500 font-bold text-slate-950 rounded-xl transition-all shadow-lg shadow-teal-700/10">
        {calculateLabel}
      </button>
    </div>
  );
}

export function ValidationMessage({ children, tipo = 'erro' }) {
  if (!children) return null;
  const classe = tipo === 'aviso'
    ? 'border-amber-800/60 bg-amber-950/30 text-amber-200'
    : 'border-rose-800/60 bg-rose-950/30 text-rose-200';
  return <div className={`p-4 rounded-xl border text-sm leading-relaxed ${classe}`}>{children}</div>;
}
