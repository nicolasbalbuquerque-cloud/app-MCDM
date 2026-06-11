'use client';

import { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import { RankingChart, PesosCriterios, SensitivityTable, MatrizResumo, MethodNote } from '../../../components/DecisionResults';
import { ActionBar, PageHeader, PesoTipoGrid, StepCard, ValidationMessage } from '../../../components/CalculatorBlocks';
import { calcularTOPSIS } from '../../../utils/topsisEngine';
import { calcularSensibilidadePesos, nomearRanking } from '../../../utils/mcdaCore';

const matrizValida = (matriz) => matriz.length >= 2 && matriz[0]?.length >= 2 && matriz.every(linha => linha.every(valor => Number.isFinite(Number(valor))));

export default function SimuladorTOPSIS() {
  const [numAlts, setNumAlts] = useState(3);
  const [numCrit, setNumCrit] = useState(3);
  const [matriz, setMatriz] = useState([]);
  const [nomesAlts, setNomesAlts] = useState([]);
  const [nomesCrit, setNomesCrit] = useState([]);
  const [pesos, setPesos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [sensibilidade, setSensibilidade] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setMatriz(Array.from({ length: numAlts }, () => Array(numCrit).fill(0)));
    setNomesAlts(Array.from({ length: numAlts }, (_, i) => `Alternativa ${i + 1}`));
    setNomesCrit(Array.from({ length: numCrit }, (_, j) => `Critério ${j + 1}`));
    setPesos(Array(numCrit).fill(1 / numCrit));
    setTipos(Array(numCrit).fill('beneficio'));
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  }, [numAlts, numCrit]);

  const atualizarPeso = (index, valor) => {
    const novos = [...pesos];
    novos[index] = Number(valor) || 0;
    setPesos(novos);
  };

  const alternarTipo = (index) => {
    const novos = [...tipos];
    novos[index] = novos[index] === 'beneficio' ? 'custo' : 'beneficio';
    setTipos(novos);
  };

  const carregarExemplo = () => {
    setNumAlts(4);
    setNumCrit(4);
    setNomesAlts(['Fornecedor A', 'Fornecedor B', 'Fornecedor C', 'Fornecedor D']);
    setNomesCrit(['Preço', 'Qualidade', 'Prazo', 'Sustentabilidade']);
    setMatriz([
      [180, 86, 12, 70],
      [210, 92, 9, 82],
      [165, 78, 16, 64],
      [195, 88, 10, 90],
    ]);
    setPesos([0.35, 0.30, 0.20, 0.15]);
    setTipos(['custo', 'beneficio', 'custo', 'beneficio']);
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  };

  const calcular = () => {
    if (!matrizValida(matriz)) {
      setErro('Preencha a matriz de decisão com valores numéricos para pelo menos 2 alternativas e 2 critérios.');
      return;
    }
    const somaPesos = pesos.reduce((acc, p) => acc + Math.max(0, Number(p) || 0), 0);
    if (somaPesos <= 0) {
      setErro('Informe pelo menos um peso intercritério positivo. Os pesos serão normalizados automaticamente.');
      return;
    }
    setErro('');
    const r = calcularTOPSIS(matriz, pesos, tipos);
    const rankingNomeado = nomearRanking(r.ranking, nomesAlts);
    const sens = calcularSensibilidadePesos({
      pesosBase: r.pesos,
      nomesAlternativas: nomesAlts,
      calcularScores: (w) => calcularTOPSIS(matriz, w, tipos).scores.map(item => item.score),
      iteracoes: 100000,
      intensidade: 0.55,
    });
    setResultado({ ...r, rankingNomeado });
    setSensibilidade(sens);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        metodo="TOPSIS"
        titulo="Calculadora TOPSIS"
        descricao="O TOPSIS ordena as alternativas pela proximidade relativa à solução ideal positiva e pelo afastamento da solução ideal negativa. A tela separa a avaliação intercritério, feita pelos pesos, da avaliação intracritério, feita pela matriz de desempenho e pelo sentido benefício/custo de cada critério."
        formula="Cᵢ = Dᵢ⁻ / (Dᵢ⁺ + Dᵢ⁻)"
      />

      <MethodNote>
        <strong>Procedimento implementado:</strong> normalização vetorial, ponderação por pesos normalizados, identificação dos ideais A⁺/A⁻ conforme benefício ou custo, cálculo das distâncias euclidianas D⁺ e D⁻, coeficiente Cᵢ, ranking decrescente e análise de sensibilidade por 100.000 perturbações dos pesos.
      </MethodNote>

      <ValidationMessage>{erro}</ValidationMessage>

      <StepCard numero="1" titulo="Configuração do problema" subtitulo="Defina quantas alternativas serão comparadas e quantos critérios compõem a decisão.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Quantidade de alternativas" type="number" value={numAlts} onChange={(e) => setNumAlts(Math.max(2, parseInt(e.target.value) || 2))} />
          <Input label="Quantidade de critérios" type="number" value={numCrit} onChange={(e) => setNumCrit(Math.max(2, parseInt(e.target.value) || 2))} />
        </div>
      </StepCard>

      <StepCard numero="2" titulo="Avaliação intercritério" subtitulo="Informe a importância relativa dos critérios. Os pesos podem ser brutos; o sistema normaliza para soma 1 antes do cálculo.">
        <PesoTipoGrid nomesCrit={nomesCrit} pesos={pesos} tipos={tipos} onPeso={atualizarPeso} onTipo={alternarTipo} />
      </StepCard>

      <StepCard numero="3" titulo="Avaliação intracritério" subtitulo="Preencha o desempenho de cada alternativa em cada critério. Critérios de custo serão minimizados na construção dos ideais.">
        <Table numAlternativas={numAlts} numCriterios={numCrit} matriz={matriz} setMatriz={setMatriz} nomesAlternativas={nomesAlts} setNomesAlternativas={setNomesAlts} nomesCriterios={nomesCrit} setNomesCriterios={setNomesCrit} />
      </StepCard>

      <ActionBar onExample={carregarExemplo} onCalculate={calcular} calculateLabel="Processar TOPSIS" />

      {resultado && (
        <StepCard numero="4" titulo="Resultado para o decisor" subtitulo="Ranking, gráfico, pesos usados, robustez e matrizes intermediárias auditáveis.">
          <div className="space-y-6">
            <RankingChart ranking={resultado.rankingNomeado} titulo="Ranking TOPSIS por proximidade relativa" scoreLabel="Cᵢ" />
            <div className="grid lg:grid-cols-2 gap-6">
              <PesosCriterios pesos={resultado.pesos} nomes={nomesCrit} />
              <SensitivityTable sensibilidade={sensibilidade} />
            </div>
            <MatrizResumo titulo="Avaliação intracritério: matriz normalizada vetorialmente" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.matrizNormalizada} />
            <MatrizResumo titulo="Matriz normalizada e ponderada" linhas={nomesAlts} colunas={nomesCrit} matriz={resultado.matrizPonderada} />
            <MatrizResumo titulo="Distâncias à solução ideal" linhas={nomesAlts} colunas={['D+', 'D-', 'Cᵢ']} matriz={resultado.scores.map(item => [item.dPositiva, item.dNegativa, item.score])} />
          </div>
        </StepCard>
      )}
    </main>
  );
}
