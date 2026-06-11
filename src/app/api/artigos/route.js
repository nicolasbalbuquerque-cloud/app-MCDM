export const dynamic = 'force-dynamic';

const HEADERS = {
  'User-Agent': 'MCDM.Analytics/1.0 (academic-search; mailto:contato@example.com)',
  Accept: 'application/json',
};

function reconstruirResumo(indice) {
  if (!indice || typeof indice !== 'object') return '';
  const termos = [];
  Object.entries(indice).forEach(([palavra, posicoes]) => {
    if (Array.isArray(posicoes)) {
      posicoes.forEach(pos => {
        if (Number.isInteger(pos)) termos[pos] = palavra;
      });
    }
  });
  return termos.filter(Boolean).join(' ');
}

function limparTexto(valor) {
  if (Array.isArray(valor)) return valor.filter(Boolean).join(' ');
  if (typeof valor === 'string') return valor;
  return '';
}

function mapearOpenAlex(item) {
  const autores = item.authorships?.map(a => ({ name: a.author?.display_name })).filter(a => a.name) || [];
  const doi = item.doi || item.ids?.doi || '';
  const url = item.primary_location?.landing_page_url || item.open_access?.oa_url || doi || item.id || '';
  const resumo = reconstruirResumo(item.abstract_inverted_index);
  return {
    fonte: 'OpenAlex',
    paperId: item.id,
    title: item.title || item.display_name || 'Título indisponível',
    abstract: resumo || 'Resumo não disponível no registro OpenAlex.',
    year: item.publication_year || null,
    authors: autores,
    url,
    doi,
    venue: item.primary_location?.source?.display_name || item.host_venue?.display_name || '',
    citationCount: item.cited_by_count || 0,
    type: item.type || '',
  };
}

function mapearCrossref(item) {
  const autores = item.author?.map(a => ({ name: [a.given, a.family].filter(Boolean).join(' ') })).filter(a => a.name) || [];
  const ano = item.published?.['date-parts']?.[0]?.[0] || item.issued?.['date-parts']?.[0]?.[0] || null;
  const doi = item.DOI ? `https://doi.org/${item.DOI}` : '';
  const url = item.URL || doi || '';
  return {
    fonte: 'Crossref',
    paperId: item.DOI || item.URL || item.title?.[0],
    title: limparTexto(item.title) || 'Título indisponível',
    abstract: limparTexto(item.abstract).replace(/<[^>]+>/g, '') || 'Resumo não disponível no registro Crossref.',
    year: ano,
    authors: autores,
    url,
    doi,
    venue: limparTexto(item['container-title']) || item.publisher || '',
    citationCount: item['is-referenced-by-count'] || 0,
    type: item.type || '',
  };
}

async function buscarOpenAlex(query, limit) {
  const url = new URL('https://api.openalex.org/works');
  url.searchParams.set('search', query);
  url.searchParams.set('per-page', String(limit));
  url.searchParams.set('sort', 'relevance_score:desc');
  url.searchParams.set('mailto', 'contato@example.com');
  const resposta = await fetch(url, { headers: HEADERS, cache: 'no-store' });
  if (!resposta.ok) throw new Error(`OpenAlex respondeu ${resposta.status}`);
  const dados = await resposta.json();
  return (dados.results || []).map(mapearOpenAlex);
}

async function buscarCrossref(query, limit) {
  const url = new URL('https://api.crossref.org/works');
  url.searchParams.set('query', query);
  url.searchParams.set('rows', String(limit));
  const resposta = await fetch(url, { headers: HEADERS, cache: 'no-store' });
  if (!resposta.ok) throw new Error(`Crossref respondeu ${resposta.status}`);
  const dados = await resposta.json();
  return (dados.message?.items || []).map(mapearCrossref);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || searchParams.get('q') || '').trim();
  const limit = Math.min(20, Math.max(1, Number(searchParams.get('limit')) || 10));

  if (!query || query.length < 2) {
    return Response.json({ data: [], items: [], fonte: null, source: null, aviso: 'Digite ao menos dois caracteres para buscar.' }, { status: 400 });
  }

  const erros = [];
  try {
    const data = await buscarOpenAlex(query, limit);
    if (data.length) return Response.json({ data, items: data, fonte: 'OpenAlex', source: 'OpenAlex', total: data.length });
  } catch (erro) {
    erros.push(erro.message);
  }

  try {
    const data = await buscarCrossref(query, limit);
    return Response.json({ data, items: data, fonte: 'Crossref', source: 'Crossref', total: data.length, aviso: erros.length ? `OpenAlex indisponível: ${erros.join('; ')}` : undefined });
  } catch (erro) {
    erros.push(erro.message);
  }

  return Response.json({ data: [], items: [], fonte: null, source: null, erro: `Não foi possível consultar as bases acadêmicas agora. ${erros.join(' | ')}` }, { status: 502 });
}
