// src/app/page.js
import Link from 'next/link';

const cards = [
  {
    titulo: 'O que é Multicritério?',
    descricao:
      'Entenda como os modelos matemáticos estruturam problemas complexos onde múltiplos objetivos e critérios técnicos entram em conflito.',
    imagem:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    alt: 'Matriz de Decisão e Análise Multicritério',
    legenda: 'Modelagem, critérios, alternativas e ranking',
    href: '/blog#fundamentos',
  },
  {
    titulo: 'Aplicações Práticas.',
    descricao:
      'Veja a aplicação real do MCDM na priorização de infraestruturas críticas e na mitigação de impactos de alagamentos e inundações urbanas.',
    imagem:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    alt: 'Infraestrutura Urbana e Drenagem Hidráulica',
    legenda: 'Modelagem de Resiliência Hidráulica Urbana',
    href: '/blog#aplicacoes',
  },
  {
    titulo: 'Grandes Pesquisadores.',
    descricao:
      'Conheça os maiores nomes da área científica mundial de MCDA/MCDM, incluindo o professor Adiel Almeida, e suas contribuições teóricas.',
    imagem:
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    alt: 'Rede de Conhecimento e Grandes Pesquisadores',
    legenda: 'Teoria, ciência da decisão e métodos multicritério',
    href: '/blog#pesquisadores',
  },
];

export default function HomePage( ) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <section className="relative border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Decisões Complexas, Soluções Científicas
            </h1>

            <p className="mt-5 text-base md:text-lg leading-8 text-slate-200">
              Entenda como os modelos matemáticos estruturam problemas complexos onde múltiplos objetivos
              e critérios técnicos entram em conflito. Navegue pela estrutura de problemas através de
              matrizes de comparação, avaliação intercritério, avaliação intracritério e rankings auditáveis.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/calculadora"
                className="inline-flex items-center justify-center rounded-full bg-teal-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-950/40 transition hover:bg-teal-400"
              >
                Abrir Calculadora
              </Link>

              <Link
                href="/artigos"
                className="inline-flex items-center justify-center rounded-full border border-slate-400/80 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300 hover:text-teal-200 hover:bg-white/5"
              >
                Ver Artigos Acadêmicos
              </Link>
            </div>
          </div>

          <div className="mt-14 grid lg:grid-cols-3 gap-6 items-stretch">
            {cards.map((card) => (
              <article
                key={card.titulo}
                className="group flex flex-col h-full bg-slate-900/55 border border-slate-700/90 rounded-2xl p-4 shadow-2xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-teal-950/40"
              >
                <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">
                  {card.titulo}
                </h2>

                <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner h-44 relative flex flex-col justify-end mb-4">
                  <img
                    src={card.imagem}
                    alt={card.alt}
                    className="w-full h-full object-cover absolute inset-0 opacity-80 transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-sm py-2 text-center border-t border-slate-800/80 z-10">
                    <span className="text-[10px] text-slate-400 font-mono block tracking-wider">
                      {card.legenda}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      {card.titulo}
                    </h3>

                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                      {card.descricao}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <Link
                      href={card.href}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-teal-500/90 px-4 py-3 text-xs font-extrabold text-white hover:bg-teal-400 gap-2 no-underline uppercase tracking-wider transition"
                    >
                      Saiba Mais
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-sm text-slate-300">
        © 2026 MCDM.Analytics • Pesquisa e Resiliência Urbana
      </footer>
    </main>
  );
}
