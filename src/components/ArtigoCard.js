// src/components/ArtigoCard.js
'use client';

export default function ArtigoCard({ artigo }) {
  const titulo = artigo.title || 'Título indisponível';
  const ano = artigo.year || 'Ano N/I';
  const resumo = artigo.abstract || 'Resumo não disponível na base consultada.';
  const urlArtigo = artigo.url || artigo.doi || '#';
  const autores = artigo.authors && artigo.authors.length > 0
    ? artigo.authors.map(a => a.name).filter(Boolean).join(', ')
    : 'Autores não listados';
  const fonte = artigo.fonte || 'Base acadêmica';
  const venue = artigo.venue || 'Periódico/evento não informado';
  const citacoes = Number.isFinite(Number(artigo.citationCount)) ? Number(artigo.citationCount) : null;

  return (
    <article className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-teal-700/70 transition-all">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-full">{fonte}</span>
        <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-950 px-2 py-1 rounded-full">{ano}</span>
        {citacoes !== null && <span className="text-[11px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-full">{citacoes} citações</span>}
      </div>

      <h3 className="text-lg font-bold text-slate-100 leading-snug mb-2">
        {titulo}
      </h3>

      <p className="text-xs text-teal-500/80 font-medium mb-2 italic truncate">
        {autores}
      </p>

      <p className="text-xs text-slate-500 mb-4 truncate">
        {venue}
      </p>

      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4">
        {resumo}
      </p>

      {urlArtigo && urlArtigo !== '#' && (
        <a
          href={urlArtigo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-bold text-teal-400 hover:text-teal-300 no-underline transition-colors"
        >
          Acessar publicação original ↗
        </a>
      )}
    </article>
  );
}
