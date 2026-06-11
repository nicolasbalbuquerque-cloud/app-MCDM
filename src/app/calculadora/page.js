// src/app/calculadora/page.js
import Link from 'next/link';

export default function PainelCalculadora() {
  const metodos = [
    {
      slug: 'maut',
      nome: 'MAUT',
      desc: 'Utilidade multiatributo',
      detalhes: 'Normalização benefício/custo, pesos intercritério, utilidades intracritério, contribuições ponderadas e ranking global.',
      saidas: ['Utilidade global', 'Contribuições', 'Sensibilidade']
    },
    {
      slug: 'topsis',
      nome: 'TOPSIS',
      desc: 'Proximidade da solução ideal',
      detalhes: 'Normalização vetorial, solução ideal positiva/negativa, distâncias D+ e D-, coeficiente de proximidade e ranking.',
      saidas: ['Matriz ponderada', 'D+ / D-', 'Ranking Cᵢ']
    },
    {
      slug: 'AHP',
      nome: 'AHP',
      desc: 'Processo hierárquico analítico',
      detalhes: 'Comparações pareadas de critérios e alternativas, autovetor principal, λmax, CI, CR e prioridade global.',
      saidas: ['CR de Saaty', 'Prioridades locais', 'Ranking global']
    },
    {
      slug: 'smarts',
      nome: 'SMARTS',
      desc: 'Swing weighting com ROC',
      detalhes: 'Ordenação de critérios, conversão em pesos ROC, normalização de utilidades e análise de estabilidade do ranking.',
      saidas: ['Pesos ROC', 'Utilidades', 'Robustez']
    },
    {
      slug: 'fitradeoff',
      nome: 'FITradeoff',
      desc: 'Tradeoff flexível',
      detalhes: 'Elicitação parcial de preferências entre critérios, espaço viável de pesos, intervalos e probabilidade de liderança.',
      saidas: ['Pesos viáveis', 'Prob. de 1º', 'Ranking robusto']
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/30 p-8 md:p-12 mb-10 shadow-2xl shadow-teal-950/20">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative max-w-4xl">
          <span className="inline-flex px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-[0.2em] mb-5">Módulo de decisão multicritério</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 mb-4 tracking-tight">
            Calculadoras com ranking, consistência e sensibilidade para o decisor
          </h1>
          <p className="text-slate-400 max-w-3xl text-base md:text-lg leading-relaxed">
            Escolha o método, cadastre alternativas e critérios, informe preferências intra e intercritério e gere resultados auditáveis com gráficos, pesos, matrizes intermediárias e análise de robustez.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {metodos.map((m) => (
          <article key={m.slug} className="group p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-xl hover:shadow-teal-950/30 min-h-[290px]">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors">{m.nome}</h2>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">{m.desc}</p>
                </div>
                <span className="text-[10px] text-teal-300 font-extrabold uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded">{m.slug}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{m.detalhes}</p>
              <div className="flex flex-wrap gap-2">
                {m.saidas.map(saida => <span key={saida} className="text-[11px] px-2 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">{saida}</span>)}
              </div>
            </div>
            <Link
              href={`/calculadora/${m.slug}`}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-center rounded-xl text-sm transition-all block no-underline shadow-lg shadow-teal-600/10"
            >
              Abrir calculadora
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
