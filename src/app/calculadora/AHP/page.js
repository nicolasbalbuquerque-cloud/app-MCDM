'use client';

import { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import { RankingChart, PesosCriterios, SensitivityTable, MatrizResumo, MethodNote } from '../../../components/DecisionResults';
import { ActionBar, PageHeader, StepCard, ValidationMessage } from '../../../components/CalculatorBlocks';
import { calcularAHPCompleto, criarMatrizParitaria, escalaSaaty } from '../../../utils/ahpEngine';
import { calcularSensibilidadePesos, nomearRanking } from '../../../utils/mcdaCore';

function MatrizParitaria({ titulo, subtitulo, itens, matriz, onChange, resultado }) {
  return (
    <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">{titulo}</h3>
          {subtitulo && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitulo}</p>}
        </div>
        {resultado && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${resultado.consistente ? 'text-emerald-300 border-emerald-800 bg-emerald-950' : 'text-rose-300 border-rose-800 bg-rose-950'}`}>
            CR = {resultado.CR} {resultado.consistente ? 'consistente' : 'revisar'}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-slate-300">
          <thead className="bg-slate-900 text-teal-400">
            <tr>
              <th className="p-3 text-left border-b border-slate-800">Comparação</th>
              {itens.map((nome, j) => <th key={j} className="p-3 border-b border-slate-800 min-w-[150px]">{nome}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {itens.map((nomeLinha, i) => (
              <tr key={i}>
                <td className="p-3 font-semibold text-slate-200 bg-slate-900/40">{nomeLinha}</td>
                {itens.map((_, j) => (
                  <td key={j} className="p-2">
                    {i === j ? (
                      <div className="p-2 bg-slate-900 rounded text-center text-slate-500 font-bold">1</div>
                    ) : i < j ? (
                      <select value={matriz[i]?.[j] ?? 1} onChange={(e) => onChange(i, j, Number(e.target.value))} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-teal-500">
                        {escalaSaaty.map(op => <option key={op.valor} value={op.valor}>{op.label}</option>)}
                      </select>
                    ) : (
                      <div className="p-2 text-right font-mono text-slate-400 text-xs">{Number(matriz[i]?.[j] || 1).toFixed(4)}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const rec = (v) => 1 / v;

export default function SimuladorAHP() {
  const [numAlts, setNumAlts] = useState(3);
  const [numCrit, setNumCrit] = useState(3);
  const [nomesAlts, setNomesAlts] = useState([]);
  const [nomesCrit, setNomesCrit] = useState([]);
  const [matrizCriterios, setMatrizCriterios] = useState([]);
  const [matrizesAlternativas, setMatrizesAlternativas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [sensibilidade, setSensibilidade] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setNomesAlts(Array.from({ length: numAlts }, (_, i) => `Alternativa ${i + 1}`));
    setNomesCrit(Array.from({ length: numCrit }, (_, j) => `Critério ${j + 1}`));
    setMatrizCriterios(criarMatrizParitaria(numCrit));
    setMatrizesAlternativas(Array.from({ length: numCrit }, () => criarMatrizParitaria(numAlts)));
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  }, [numAlts, numCrit]);

  const atualizarNomeAlt = (index, valor) => {
    const novos = [...nomesAlts];
    novos[index] = valor || `Alternativa ${index + 1}`;
    setNomesAlts(novos);
  };

  const atualizarNomeCrit = (index, valor) => {
    const novos = [...nomesCrit];
    novos[index] = valor || `Critério ${index + 1}`;
    setNomesCrit(novos);
  };

  const atualizarMatrizCriterios = (i, j, valor) => {
    const nova = matrizCriterios.map(row => [...row]);
    nova[i][j] = valor;
    nova[j][i] = 1 / valor;
    setMatrizCriterios(nova);
  };

  const atualizarMatrizAlternativas = (crit, i, j, valor) => {
    const novas = matrizesAlternativas.map(m => m.map(row => [...row]));
    novas[crit][i][j] = valor;
    novas[crit][j][i] = 1 / valor;
    setMatrizesAlternativas(novas);
  };

  const carregarExemplo = () => {
    setNumAlts(3);
    setNumCrit(3);
    setNomesAlts(['Fornecedor A', 'Fornecedor B', 'Fornecedor C']);
    setNomesCrit(['Custo', 'Qualidade', 'Prazo']);
    setMatrizCriterios([
      [1, rec(3), 3],
      [3, 1, 5],
      [rec(3), rec(5), 1],
    ]);
    setMatrizesAlternativas([
      [[1, 5, 3], [rec(5), 1, rec(2)], [rec(3), 2, 1]],
      [[1, rec(3), rec(5)], [3, 1, rec(2)], [5, 2, 1]],
      [[1, rec(2), 4], [2, 1, 5], [rec(4), rec(5), 1]],
    ]);
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  };

  const calcular = () => {
    if (numAlts < 2 || numCrit < 2) {
      setErro('O AHP exige pelo menos 2 alternativas e 2 critérios.');
      return;
    }
    setErro('');
    const r = calcularAHPCompleto({ matrizCriterios, matrizesAlternativas });
    const rankingNomeado = nomearRanking(r.ranking, nomesAlts);
    const locais = r.locais.map(item => item.pesos);
    const sens = calcularSensibilidadePesos({
      pesosBase: r.criterios.pesos,
      nomesAlternativas: nomesAlts,
      calcularScores: (pesosCrit) => nomesAlts.map((_, alt) => pesosCrit.reduce((acc, w, crit) => acc + w * (locais[crit]?.[alt] || 0), 0)),
      iteracoes: 100000,
      intensidade: 0.55,
    });
    setResultado({ ...r, rankingNomeado });
    setSensibilidade(sens);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        metodo="AHP"
        titulo="Calculadora AHP completa"
        descricao="O AHP exige duas avaliações: comparação intercritério, para obter os pesos dos critérios, e comparação intracritério, para obter as prioridades locais das alternativas dentro de cada critério. O ranking global combina as duas camadas de preferência."
        formula="Prioridade global(a) = Σ wⱼ · pⱼ(a)"
      />

      <MethodNote>
        <strong>Procedimento implementado:</strong> vetor de prioridades por aproximação do autovetor principal, λmax, índice de consistência CI, razão de consistência CR de Saaty em todas as matrizes, prioridades locais, contribuições globais e análise de sensibilidade com 100.000 perturbações dos pesos dos critérios.
      </MethodNote>

      <ValidationMessage>{erro}</ValidationMessage>

      <StepCard numero="1" titulo="Configuração do problema" subtitulo="Defina alternativas e critérios e nomeie os elementos da hierarquia de decisão.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mb-6">
          <Input label="Quantidade de alternativas" type="number" value={numAlts} onChange={(e) => setNumAlts(Math.max(2, parseInt(e.target.value) || 2))} />
          <Input label="Quantidade de critérios" type="number" value={numCrit} onChange={(e) => setNumCrit(Math.max(2, parseInt(e.target.value) || 2))} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Alternativas</h3>
            {nomesAlts.map((nome, i) => <Input key={i} label={`Alternativa ${i + 1}`} value={nome} onChange={(e) => atualizarNomeAlt(i, e.target.value)} />)}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Critérios</h3>
            {nomesCrit.map((nome, i) => <Input key={i} label={`Critério ${i + 1}`} value={nome} onChange={(e) => atualizarNomeCrit(i, e.target.value)} />)}
          </div>
        </div>
      </StepCard>

      <StepCard numero="2" titulo="Avaliação intercritério" subtitulo="Compare os critérios par a par usando a escala fundamental de Saaty. A parte inferior da matriz é preenchida automaticamente com os recíprocos.">
        <MatrizParitaria titulo="Comparação pareada dos critérios" subtitulo="Pergunta: quão mais importante é o critério da linha em relação ao critério da coluna?" itens={nomesCrit} matriz={matrizCriterios} onChange={atualizarMatrizCriterios} resultado={resultado?.criterios} />
      </StepCard>

      <StepCard numero="3" titulo="Avaliação intracritério das alternativas" subtitulo="Para cada critério, compare as alternativas par a par. Isso gera as prioridades locais pⱼ(a).">
        <div className="space-y-6">
          {nomesCrit.map((criterio, c) => (
            <MatrizParitaria key={c} titulo={`Alternativas no critério: ${criterio}`} subtitulo="Pergunta: considerando somente este critério, qual alternativa é preferida?" itens={nomesAlts} matriz={matrizesAlternativas[c] || []} onChange={(i, j, valor) => atualizarMatrizAlternativas(c, i, j, valor)} resultado={resultado?.locais?.[c]} />
          ))}
        </div>
      </StepCard>

      <ActionBar onExample={carregarExemplo} onCalculate={calcular} calculateLabel="Processar AHP completo" />

      {resultado && (
        <StepCard numero="4" titulo="Resultado para o decisor" subtitulo="Ranking global, gráfico, pesos dos critérios, consistência e prioridades locais.">
          <div className="space-y-6">
            <RankingChart ranking={resultado.rankingNomeado} titulo="Ranking AHP por prioridade global" scoreLabel="Prioridade" />
            <div className="grid lg:grid-cols-2 gap-6">
              <PesosCriterios pesos={resultado.criterios.pesos} nomes={nomesCrit} />
              <SensitivityTable sensibilidade={sensibilidade} />
            </div>
            {!resultado.consistenteGlobal && (
              <ValidationMessage tipo="aviso">Há pelo menos uma matriz com CR acima de 0,10. O ranking foi calculado, mas os julgamentos devem ser revisados antes da decisão final.</ValidationMessage>
            )}
            <MatrizResumo titulo="Avaliação intracritério: prioridades locais das alternativas por critério" linhas={nomesAlts} colunas={nomesCrit} matriz={nomesAlts.map((_, alt) => resultado.locais.map(local => local.pesos[alt]))} />
            <MatrizResumo titulo="Contribuições globais por critério" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.scores.map(item => item.contribuicoes)} />
          </div>
        </StepCard>
      )}
    </main>
  );
}
