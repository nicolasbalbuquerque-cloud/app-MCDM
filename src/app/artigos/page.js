// src/app/artigos/page.js
'use client';

import { useState } from 'react';
import ArtigoCard from '../../components/ArtigoCard';

export default function BuscadorArtigos() {
  const [termoBusca, setTermoBusca] = useState('');
  const [metodoSelecionado, setMetodoSelecionado] = useState('');
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [fonte, setFonte] = useState('');
  const [ultimaBusca, setUltimaBusca] = useState('');

  const metodosMCDM = ['MAUT', 'TOPSIS', 'AHP', 'SMARTS', 'FITradeoff', 'ELECTRE', 'PROMETHEE'];

  const buscarArtigosCientificos = async (queryCustomizada) => {
    const queryFinal = (queryCustomizada || termoBusca || '').trim();
    if (queryFinal.length < 2) {
      setErro('Digite um termo de busca com pelo menos dois caracteres.');
      setArtigos([]);
      setFonte('');
      return;
    }

    setCarregando(true);
    setErro('');
    setFonte('');
    setUltimaBusca(queryFinal);

    try {
      const resposta = await fetch(`/api/artigos?query=${encodeURIComponent(queryFinal)}&limit=10`, { cache: 'no-store' });
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || dados.aviso || 'A consulta acadêmica falhou.');
      }

      setArtigos(dados.data || []);
      setFonte(dados.fonte || 'Base acadêmica');
      if (dados.aviso) setErro(dados.aviso);
      if (!dados.data?.length) setErro('Nenhum resultado encontrado para a busca informada. Tente termos em inglês e português.');
    } catch (falha) {
      setArtigos([]);
      setErro(falha.message || 'Erro inesperado ao consultar bases acadêmicas.');
    } finally {
      setCarregando(false);
    }
  };

  const lidarComFiltroRapido = (metodo) => {
    setMetodoSelecionado(metodo);
    const buscaContexto = `${metodo} multicriteria decision analysis urban flood infrastructure resilience`;
    setTermoBusca(buscaContexto);
    buscarArtigosCientificos(buscaContexto);
  };

  const submeter = (evento) => {
    evento.preventDefault();
    setMetodoSelecionado('');
    buscarArtigosCientificos(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-500 mb-3">OpenAlex + Crossref</p>
        <h1 className="text-4xl font-extrabold text-teal-400 mb-3 tracking-tight">
          Buscador Acadêmico Integrado
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-base leading-relaxed">
          Pesquise artigos científicos sobre métodos multicritério e infraestrutura urbana. A busca usa uma rota interna da aplicação, consulta a base OpenAlex como fonte principal e utiliza Crossref como contingência quando necessário.
        </p>
      </header>

      <section className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Filtros rápidos por método</h2>
        <div className="flex flex-wrap gap-2">
          {metodosMCDM.map((metodo) => (
            <button
              key={metodo}
              type="button"
              onClick={() => lidarComFiltroRapido(metodo)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                metodoSelecionado === metodo
                  ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-700 hover:text-teal-300'
              }`}
            >
              {metodo}
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={submeter} className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Ex.: AHP flood risk management; MAUT urban drainage; TOPSIS infrastructure resilience"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-teal-500 text-slate-100 text-sm"
        />
        <button
          type="submit"
          disabled={carregando}
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed font-bold text-slate-950 text-sm transition-colors"
        >
          {carregando ? 'Buscando...' : 'Buscar artigos'}
        </button>
      </form>

      <div className="min-h-8 mb-6">
        {fonte && !carregando && (
          <p className="text-sm text-slate-400">
            Resultados de <strong className="text-teal-300">{fonte}</strong> para: <span className="text-slate-200">{ultimaBusca}</span>
          </p>
        )}
        {erro && (
          <p className="mt-2 text-sm text-amber-300 bg-amber-950/30 border border-amber-800/50 rounded-xl p-3">
            {erro}
          </p>
        )}
      </div>

      <section className="space-y-6">
        {carregando && (
          <div className="text-center text-teal-400 animate-pulse font-medium text-sm py-10 border border-dashed border-teal-900 rounded-2xl">
            Consultando bases acadêmicas e normalizando resultados...
          </div>
        )}

        {!carregando && artigos.length === 0 && !erro && (
          <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-2xl text-sm">
            Nenhum artigo carregado. Use a busca manual ou clique em um método para consultar a literatura.
          </div>
        )}

        {!carregando && artigos.map((artigo) => (
          <ArtigoCard key={artigo.paperId || artigo.url || artigo.title} artigo={artigo} />
        ))}
      </section>
    </main>
  );
}
