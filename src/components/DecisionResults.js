// src/components/DecisionResults.js
const fmt = (valor, casas = 4) => Number.isFinite(valor) ? Number(valor).toFixed(casas) : '-';
const pct = (valor) => Number.isFinite(valor) ? `${(valor * 100).toFixed(1)}%` : '-';

export function RankingChart({ ranking = [], titulo = 'Ranking das alternativas', scoreLabel = 'Score' }) {
  if (!ranking.length) return null;
  const max = Math.max(...ranking.map(item => Math.abs(item.score)), 1e-12);
  return (
    <section className="p-6 bg-slate-900 border border-teal-500/20 rounded-xl animate-fadeIn">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-teal-400">{titulo}</h2>
          <p className="text-sm text-slate-400 mt-1">Barras horizontais ordenadas do melhor para o pior desempenho.</p>
        </div>
        <span className="text-xs uppercase tracking-wider text-slate-500 border border-slate-800 rounded-full px-3 py-1">{scoreLabel}</span>
      </div>
      <div className="space-y-3">
        {ranking.map((item, index) => (
          <div key={item.id ?? index} className="grid md:grid-cols-[190px_1fr_96px] gap-3 items-center">
            <div className="text-sm font-semibold text-slate-200 truncate">{index + 1}. {item.nome}</div>
            <div className="h-9 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden" role="img" aria-label={`Barra do ranking de ${item.nome}`}>
              <div
                className="h-full bg-gradient-to-r from-teal-700 to-cyan-400 flex items-center justify-end pr-3 text-xs font-bold text-slate-950"
                style={{ width: `${Math.max(4, (Math.abs(item.score) / max) * 100)}%` }}
              >
                {fmt(item.score)}
              </div>
            </div>
            <div className="text-right font-mono text-teal-300 text-sm">{fmt(item.score)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-950/70 text-slate-400">
            <tr>
              <th className="p-2 text-left border-b border-slate-800">Posição</th>
              <th className="p-2 text-left border-b border-slate-800">Alternativa</th>
              <th className="p-2 text-right border-b border-slate-800">{scoreLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ranking.map((item, index) => (
              <tr key={`tab-${item.id ?? index}`}>
                <td className="p-2 text-slate-300">{index + 1}º</td>
                <td className="p-2 font-semibold text-slate-200">{item.nome}</td>
                <td className="p-2 text-right font-mono text-teal-300">{fmt(item.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PesosCriterios({ pesos = [], nomes = [], intervalos = null, titulo = 'Pesos intercritério normalizados' }) {
  if (!pesos.length) return null;
  return (
    <section className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-bold text-slate-100 mb-4">{titulo}</h3>
      <div className="space-y-3">
        {pesos.map((peso, j) => (
          <div key={j}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{nomes[j] || `Critério ${j + 1}`}</span>
              <span className="font-mono text-teal-300">{pct(peso)}</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-teal-500" style={{ width: `${Math.max(2, peso * 100)}%` }} />
            </div>
            {intervalos?.[j] && (
              <p className="text-xs text-slate-500 mt-1">Intervalo viável: {pct(intervalos[j].min)} a {pct(intervalos[j].max)}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SensitivityTable({ sensibilidade, titulo = 'Análise de sensibilidade dos pesos' }) {
  if (!sensibilidade?.resumo?.length) return null;
  return (
    <section className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-bold text-slate-100 mb-2">{titulo}</h3>
      <p className="text-sm text-slate-400 mb-4">
        Foram executadas {sensibilidade.iteracoes?.toLocaleString('pt-BR')} simulações determinísticas variando os pesos e observando a estabilidade do ranking.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-slate-400 bg-slate-950/70">
            <tr>
              <th className="p-3 border-b border-slate-800">Alternativa</th>
              <th className="p-3 border-b border-slate-800 text-right">Prob. de 1º</th>
              <th className="p-3 border-b border-slate-800 text-right">Rank médio</th>
              <th className="p-3 border-b border-slate-800 text-right">Melhor</th>
              <th className="p-3 border-b border-slate-800 text-right">Pior</th>
              <th className="p-3 border-b border-slate-800 text-right">Score médio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sensibilidade.resumo.map(item => (
              <tr key={item.id} className="hover:bg-slate-950/40">
                <td className="p-3 font-semibold text-slate-200">{item.nome}</td>
                <td className="p-3 text-right font-mono text-teal-300">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-cyan-400" style={{ width: `${Math.max(0, Math.min(1, item.probPrimeiro || 0)) * 100}%` }} />
                    </div>
                    <span>{pct(item.probPrimeiro)}</span>
                  </div>
                </td>
                <td className="p-3 text-right font-mono">{fmt(item.rankMedio, 2)}</td>
                <td className="p-3 text-right font-mono">{item.melhorPosicao}</td>
                <td className="p-3 text-right font-mono">{item.piorPosicao}</td>
                <td className="p-3 text-right font-mono">{fmt(item.scoreMedio ?? item.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MatrizResumo({ titulo, linhas = [], colunas = [], matriz = [], casas = 4 }) {
  if (!matriz?.length) return null;
  return (
    <section className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-bold text-slate-100 mb-4">{titulo}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-right border-collapse">
          <thead className="bg-slate-950/70 text-slate-400">
            <tr>
              <th className="p-2 text-left border-b border-slate-800">Item</th>
              {colunas.map((c, j) => <th key={j} className="p-2 border-b border-slate-800">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {matriz.map((linha, i) => (
              <tr key={i}>
                <td className="p-2 text-left text-slate-300 font-semibold">{linhas[i] || `Linha ${i + 1}`}</td>
                {linha.map((valor, j) => <td key={j} className="p-2 font-mono">{fmt(valor, casas)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MethodNote({ children }) {
  return <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-sm text-slate-300 leading-relaxed">{children}</div>;
}
