'use client';

import { useEffect, useMemo, useState } from 'react';
import Input from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import { RankingChart, PesosCriterios, SensitivityTable, MatrizResumo, MethodNote } from '../../../components/DecisionResults';
import { ActionBar, PageHeader, StepCard, ValidationMessage } from '../../../components/CalculatorBlocks';
import { calcularFITradeoff } from '../../../utils/fitradeoffengine';
import { nomearRanking } from '../../../utils/mcdaCore';

const matrizValida = (matriz) => matriz.length >= 2 && matriz[0]?.length >= 2 && matriz.every(linha => linha.every(valor => Number.isFinite(Number(valor))));

export default function SimuladorFITradeoff() {
  const [numAlts, setNumAlts] = useState(3);
  const [numCrit, setNumCrit] = useState(3);
  const [matriz, setMatriz] = useState([]);
  const [nomesAlts, setNomesAlts] = useState([]);
  const [nomesCrit, setNomesCrit] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setMatriz(Array.from({ length: numAlts }, () => Array(numCrit).fill(0)));
    setNomesAlts(Array.from({ length: numAlts }, (_, i) => `Alternativa ${i + 1}`));
    setNomesCrit(Array.from({ length: numCrit }, (_, j) => `Critério ${j + 1}`));
    setTipos(Array(numCrit).fill('beneficio'));
    setRespostas({});
    setResultado(null);
    setErro('');
  }, [numAlts, numCrit]);

  const pares = useMemo(() => {
    const lista = [];
    for (let i = 0; i < numCrit; i++) {
      for (let j = i + 1; j < numCrit; j++) lista.push([i, j]);
    }
    return lista;
  }, [numCrit]);

  const alternarTipo = (index) => {
    const novos = [...tipos];
    novos[index] = novos[index] === 'beneficio' ? 'custo' : 'beneficio';
    setTipos(novos);
  };

  const definirResposta = (a, b, relacao) => {
    setRespostas(prev => ({ ...prev, [`${a}-${b}`]: relacao }));
  };

  const carregarExemplo = () => {
    setNumAlts(4);
    setNumCrit(4);
    setNomesAlts(['Projeto A', 'Projeto B', 'Projeto C', 'Projeto D']);
    setNomesCrit(['Benefício econômico', 'Custo', 'Risco', 'Impacto ambiental']);
    setMatriz([
      [88, 120, 35, 72],
      [76, 95, 28, 80],
      [93, 150, 42, 68],
      [70, 85, 22, 85],
    ]);
    setTipos(['beneficio', 'custo', 'custo', 'beneficio']);
    setRespostas({ '0-1': 'a', '0-2': 'a', '0-3': 'a', '1-2': 'b', '1-3': 'b', '2-3': 'indiferente' });
    setResultado(null);
    setErro('');
  };

  const calcular = () => {
    if (!matrizValida(matriz)) {
      setErro('Preencha a matriz de consequência com valores numéricos para pelo menos 2 alternativas e 2 critérios.');
      return;
    }
    setErro('');
    const restricoes = pares.map(([a, b]) => ({ a, b, relacao: respostas[`${a}-${b}`] || 'pular' })).filter(r => r.relacao !== 'pular');
    const r = calcularFITradeoff(matriz, restricoes, tipos, { iteracoes: 100000 });
    const rankingNomeado = nomearRanking(r.ranking, nomesAlts);
    const sensibilidade = {
      ...r.sensibilidade,
      resumo: r.sensibilidade.resumo.map(item => ({ ...item, nome: nomesAlts[item.id] || `Alternativa ${item.id + 1}` })),
    };
    setResultado({ ...r, rankingNomeado, sensibilidade });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        metodo="FITradeoff"
        titulo="Calculadora FITradeoff"
        descricao="O FITradeoff trabalha com informação parcial do decisor. A avaliação intracritério vem da matriz de desempenho normalizada; a avaliação intercritério vem das comparações declaradas entre critérios, que delimitam uma região viável de pesos."
        formula="Score(a) = média de Σ wⱼ · uⱼ(a) no espaço viável"
      />

      <MethodNote>
        <strong>Procedimento implementado:</strong> esta versão operacional usa aproximação por amostragem determinística de 100.000 vetores no simplex de pesos, filtra os vetores que respeitam as preferências declaradas e apresenta intervalos de pesos, intervalos de score, utilidade média e probabilidade de cada alternativa liderar. O método é apresentado como apoio robusto por informação parcial, sem esconder quando poucas amostras são viáveis.
      </MethodNote>

      <ValidationMessage>{erro}</ValidationMessage>

      <StepCard numero="1" titulo="Configuração do problema" subtitulo="Defina alternativas e critérios para iniciar a matriz de consequência e as perguntas de tradeoff.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Quantidade de alternativas" type="number" value={numAlts} onChange={(e) => setNumAlts(Math.max(2, parseInt(e.target.value) || 2))} />
          <Input label="Quantidade de critérios" type="number" value={numCrit} onChange={(e) => setNumCrit(Math.max(2, parseInt(e.target.value) || 2))} />
        </div>
      </StepCard>

      <StepCard numero="2" titulo="Avaliação intracritério" subtitulo="Informe se cada critério é benefício ou custo e preencha os desempenhos das alternativas. Estes valores serão convertidos em utilidades normalizadas.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {nomesCrit.map((nome, j) => (
            <button key={j} type="button" onClick={() => alternarTipo(j)} className={`p-3 rounded-xl text-left border ${tipos[j] === 'beneficio' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'}`}>
              <span className="block font-semibold text-sm">{nome}</span>
              <span className="text-xs uppercase">{tipos[j] === 'beneficio' ? 'benefício' : 'custo'}</span>
            </button>
          ))}
        </div>
        <Table numAlternativas={numAlts} numCriterios={numCrit} matriz={matriz} setMatriz={setMatriz} nomesAlternativas={nomesAlts} setNomesAlternativas={setNomesAlts} nomesCriterios={nomesCrit} setNomesCriterios={setNomesCrit} />
      </StepCard>

      <StepCard numero="3" titulo="Avaliação intercritério por informação parcial" subtitulo="Responda somente as comparações de peso que conseguir afirmar. Perguntas puladas não geram restrição, e respostas de indiferença permitem pesos próximos entre os critérios.">
        <div className="grid lg:grid-cols-2 gap-4">
          {pares.map(([a, b]) => {
            const chave = `${a}-${b}`;
            const atual = respostas[chave] || 'pular';
            return (
              <div key={chave} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <p className="font-semibold text-slate-200">Entre <span className="text-teal-300">{nomesCrit[a]}</span> e <span className="text-teal-300">{nomesCrit[b]}</span>, qual critério deve receber maior peso?</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <button type="button" onClick={() => definirResposta(a, b, 'a')} className={`px-3 py-2 rounded text-xs font-bold border ${atual === 'a' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>{nomesCrit[a]}</button>
                  <button type="button" onClick={() => definirResposta(a, b, 'b')} className={`px-3 py-2 rounded text-xs font-bold border ${atual === 'b' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>{nomesCrit[b]}</button>
                  <button type="button" onClick={() => definirResposta(a, b, 'indiferente')} className={`px-3 py-2 rounded text-xs font-bold border ${atual === 'indiferente' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>Indiferente</button>
                  <button type="button" onClick={() => definirResposta(a, b, 'pular')} className={`px-3 py-2 rounded text-xs font-bold border ${atual === 'pular' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>Sem resposta</button>
                </div>
              </div>
            );
          })}
        </div>
      </StepCard>

      <ActionBar onExample={carregarExemplo} onCalculate={calcular} calculateLabel="Processar FITradeoff" />

      {resultado && (
        <StepCard numero="4" titulo="Resultado para o decisor" subtitulo="Ranking médio no espaço viável, intervalos de pesos, robustez e utilidades normalizadas.">
          <div className="space-y-6">
            <RankingChart ranking={resultado.rankingNomeado} titulo="Ranking FITradeoff por utilidade média viável" scoreLabel="Score médio" />
            <div className="grid lg:grid-cols-2 gap-6">
              <PesosCriterios pesos={resultado.pesos} nomes={nomesCrit} intervalos={resultado.intervalosPesos} titulo="Pesos médios e intervalos viáveis" />
              <SensitivityTable sensibilidade={resultado.sensibilidade} titulo="Robustez no espaço de pesos FITradeoff" />
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-300">
              Amostras aceitas: <strong className="text-teal-300">{resultado.amostragem.amostras.length.toLocaleString('pt-BR')}</strong> de {resultado.amostragem.iteracoes.toLocaleString('pt-BR')} vetores. Taxa de aceitação: <strong className="text-teal-300">{(resultado.amostragem.taxaAceitacao * 100).toFixed(2)}%</strong>{resultado.amostragem.fallback ? '. As restrições foram muito restritivas; foi usado fallback equiponderado.' : '.'}
            </div>
            <MatrizResumo titulo="Avaliação intracritério: utilidades normalizadas" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.utilidades} />
            <MatrizResumo titulo="Intervalos de score das alternativas" linhas={nomesAlts} colunas={['Mínimo', 'Médio', 'Máximo', 'Prob. 1º']} matriz={resultado.scores.map(item => [item.scoreMin, item.score, item.scoreMax, item.probPrimeiro])} />
          </div>
        </StepCard>
      )}
    </main>
  );
}
