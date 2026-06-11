'use client';

import { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import { RankingChart, PesosCriterios, SensitivityTable, MatrizResumo, MethodNote } from '../../../components/DecisionResults';
import { ActionBar, PageHeader, StepCard, ValidationMessage } from '../../../components/CalculatorBlocks';
import { calcularSMARTS } from '../../../utils/smartsEngine';
import { calcularMAUT } from '../../../utils/mautEngine';
import { calcularSensibilidadePesos, nomearRanking } from '../../../utils/mcdaCore';

const matrizValida = (matriz) => matriz.length >= 2 && matriz[0]?.length >= 2 && matriz.every(linha => linha.every(valor => Number.isFinite(Number(valor))));

export default function SimuladorSMARTS() {
  const [numAlts, setNumAlts] = useState(3);
  const [numCrit, setNumCrit] = useState(3);
  const [matriz, setMatriz] = useState([]);
  const [nomesAlts, setNomesAlts] = useState([]);
  const [nomesCrit, setNomesCrit] = useState([]);
  const [ordemCrit, setOrdemCrit] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [sensibilidade, setSensibilidade] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setMatriz(Array.from({ length: numAlts }, () => Array(numCrit).fill(0)));
    setNomesAlts(Array.from({ length: numAlts }, (_, i) => `Alternativa ${i + 1}`));
    setNomesCrit(Array.from({ length: numCrit }, (_, j) => `Critério ${j + 1}`));
    setOrdemCrit(Array.from({ length: numCrit }, (_, j) => j));
    setTipos(Array(numCrit).fill('beneficio'));
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  }, [numAlts, numCrit]);

  const moverCriterio = (criterio, direcao) => {
    const nova = [...ordemCrit];
    const pos = nova.indexOf(criterio);
    const alvo = pos + direcao;
    if (pos < 0 || alvo < 0 || alvo >= nova.length) return;
    [nova[pos], nova[alvo]] = [nova[alvo], nova[pos]];
    setOrdemCrit(nova);
  };

  const alternarTipo = (index) => {
    const novos = [...tipos];
    novos[index] = novos[index] === 'beneficio' ? 'custo' : 'beneficio';
    setTipos(novos);
  };

  const carregarExemplo = () => {
    setNumAlts(4);
    setNumCrit(4);
    setNomesAlts(['Sistema A', 'Sistema B', 'Sistema C', 'Sistema D']);
    setNomesCrit(['Confiabilidade', 'Custo total', 'Usabilidade', 'Tempo de implantação']);
    setMatriz([
      [92, 480, 78, 35],
      [85, 420, 83, 28],
      [95, 560, 74, 42],
      [80, 390, 88, 24],
    ]);
    setTipos(['beneficio', 'custo', 'beneficio', 'custo']);
    setOrdemCrit([0, 1, 2, 3]);
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  };

  const calcular = () => {
    if (!matrizValida(matriz)) {
      setErro('Preencha a matriz de consequência com valores numéricos para pelo menos 2 alternativas e 2 critérios.');
      return;
    }
    if (new Set(ordemCrit).size !== numCrit) {
      setErro('A ordenação swing deve conter cada critério exatamente uma vez.');
      return;
    }
    setErro('');
    const r = calcularSMARTS(matriz, ordemCrit, tipos);
    const rankingNomeado = nomearRanking(r.ranking, nomesAlts);
    const sens = calcularSensibilidadePesos({
      pesosBase: r.pesos,
      nomesAlternativas: nomesAlts,
      calcularScores: (w) => calcularMAUT(matriz, w, tipos).scores.map(item => item.score),
      iteracoes: 100000,
      intensidade: 0.55,
    });
    setResultado({ ...r, rankingNomeado });
    setSensibilidade(sens);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        metodo="SMARTS"
        titulo="Calculadora SMARTS"
        descricao="O SMARTS usa swing weighting para ordenar os critérios conforme a relevância do salto do pior para o melhor nível. A ordem é convertida em pesos ROC e aplicada sobre utilidades normalizadas das alternativas."
        formula="wⱼ = ROC(posição do critério j)"
      />

      <MethodNote>
        <strong>Procedimento implementado:</strong> o decisor ordena os critérios por swing de importância; o sistema calcula pesos Rank Order Centroid, normaliza os desempenhos benefício/custo, agrega as utilidades e executa análise de robustez com 100.000 perturbações dos pesos ROC.
      </MethodNote>

      <ValidationMessage>{erro}</ValidationMessage>

      <StepCard numero="1" titulo="Configuração do problema" subtitulo="Defina o número de alternativas e critérios antes de ordenar os swings.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Quantidade de alternativas" type="number" value={numAlts} onChange={(e) => setNumAlts(Math.max(2, parseInt(e.target.value) || 2))} />
          <Input label="Quantidade de critérios" type="number" value={numCrit} onChange={(e) => setNumCrit(Math.max(2, parseInt(e.target.value) || 2))} />
        </div>
      </StepCard>

      <StepCard numero="2" titulo="Avaliação intercritério: ordenação swing" subtitulo="Coloque no topo o critério cujo salto do pior para o melhor desempenho agrega mais valor à decisão. O sistema converte esta ordem em pesos ROC.">
        <div className="space-y-3">
          {ordemCrit.map((criterio, pos) => (
            <div key={criterio} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Posição swing {pos + 1}</span>
                <p className="font-semibold text-slate-200">{nomesCrit[criterio]}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => moverCriterio(criterio, -1)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold">Subir</button>
                <button type="button" onClick={() => moverCriterio(criterio, 1)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold">Descer</button>
              </div>
            </div>
          ))}
        </div>
      </StepCard>

      <StepCard numero="3" titulo="Avaliação intracritério" subtitulo="Defina o sentido benefício/custo e preencha os desempenhos das alternativas em cada critério.">
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

      <ActionBar onExample={carregarExemplo} onCalculate={calcular} calculateLabel="Processar SMARTS" />

      {resultado && (
        <StepCard numero="4" titulo="Resultado para o decisor" subtitulo="Ranking final, pesos ROC, robustez e matrizes de utilidade para auditoria.">
          <div className="space-y-6">
            <RankingChart ranking={resultado.rankingNomeado} titulo="Ranking SMARTS por utilidade ponderada" scoreLabel="Score" />
            <div className="grid lg:grid-cols-2 gap-6">
              <PesosCriterios pesos={resultado.pesos} nomes={nomesCrit} />
              <SensitivityTable sensibilidade={sensibilidade} />
            </div>
            <MatrizResumo titulo="Avaliação intracritério: utilidades normalizadas" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.utilidades} />
            <MatrizResumo titulo="Contribuições ponderadas pelos pesos ROC" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.scores.map(item => item.contribuicoes)} />
          </div>
        </StepCard>
      )}
    </main>
  );
}
