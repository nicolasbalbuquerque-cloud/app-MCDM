'use client';

import { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import { RankingChart, PesosCriterios, SensitivityTable, MatrizResumo, MethodNote } from '../../../components/DecisionResults';
import { ActionBar, PageHeader, PesoTipoGrid, StepCard, ValidationMessage } from '../../../components/CalculatorBlocks';
import { calcularMAUT } from '../../../utils/mautEngine';
import { calcularSensibilidadePesos, nomearRanking } from '../../../utils/mcdaCore';

const matrizValida = (matriz) => matriz.length >= 2 && matriz[0]?.length >= 2 && matriz.every(linha => linha.every(valor => Number.isFinite(Number(valor))));

export default function SimuladorMAUT() {
  const [numAlts, setNumAlts] = useState(3);
  const [numCrit, setNumCrit] = useState(3);
  const [matriz, setMatriz] = useState([]);
  const [nomesAlts, setNomesAlts] = useState([]);
  const [nomesCrit, setNomesCrit] = useState([]);
  const [pesos, setPesos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [perfilRisco, setPerfilRisco] = useState('neutro');
  const [intensidadeRisco, setIntensidadeRisco] = useState(4);
  const [resultado, setResultado] = useState(null);
  const [sensibilidade, setSensibilidade] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setMatriz(Array.from({ length: numAlts }, () => Array(numCrit).fill(0)));
    setNomesAlts(Array.from({ length: numAlts }, (_, i) => `Alternativa ${i + 1}`));
    setNomesCrit(Array.from({ length: numCrit }, (_, j) => `Critério ${j + 1}`));
    setPesos(Array(numCrit).fill(1 / numCrit));
    setTipos(Array(numCrit).fill('beneficio'));
    setPerfilRisco('neutro');
    setIntensidadeRisco(4);
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
    setNomesAlts(['Projeto Alfa', 'Projeto Beta', 'Projeto Gama', 'Projeto Delta']);
    setNomesCrit(['Retorno esperado', 'Risco', 'Prazo', 'Impacto social']);
    setMatriz([
      [82, 35, 14, 75],
      [76, 22, 10, 68],
      [91, 48, 18, 83],
      [70, 18, 8, 62],
    ]);
    setPesos([0.40, 0.25, 0.20, 0.15]);
    setTipos(['beneficio', 'custo', 'custo', 'beneficio']);
    setPerfilRisco('averso');
    setIntensidadeRisco(4);
    setResultado(null);
    setSensibilidade(null);
    setErro('');
  };

  const calcular = () => {
    if (!matrizValida(matriz)) {
      setErro('Preencha a matriz de consequência com valores numéricos para pelo menos 2 alternativas e 2 critérios.');
      return;
    }
    const somaPesos = pesos.reduce((acc, p) => acc + Math.max(0, Number(p) || 0), 0);
    if (somaPesos <= 0) {
      setErro('Informe pelo menos um peso intercritério positivo. Os pesos serão normalizados automaticamente.');
      return;
    }
    setErro('');
    const r = calcularMAUT(matriz, pesos, tipos, perfilRisco, intensidadeRisco);
    const rankingNomeado = nomearRanking(r.ranking, nomesAlts);
    const sens = calcularSensibilidadePesos({
      pesosBase: r.pesos,
      nomesAlternativas: nomesAlts,
      calcularScores: (w) => calcularMAUT(matriz, w, tipos, perfilRisco, intensidadeRisco).scores.map(item => item.score),
      iteracoes: 100000,
      intensidade: 0.55,
    });
    setResultado({ ...r, rankingNomeado });
    setSensibilidade(sens);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        metodo="MAUT"
        titulo="Calculadora MAUT"
        descricao="A MAUT calcula a utilidade global por agregação aditiva. A avaliação intercritério define os pesos dos critérios; a avaliação intracritério transforma os desempenhos da matriz em utilidades normalizadas entre 0 e 1 conforme benefício ou custo."
        formula="U(a) = Σ wⱼ · uⱼ(a)"
      />

      <MethodNote>
        <strong>Procedimento implementado:</strong> normalização min-máx por critério, inversão para critérios de custo, aplicação de função de utilidade logarítmica, linear ou logística conforme o perfil de risco do decisor, normalização automática de pesos, contribuições ponderadas por critério, ranking por utilidade global e sensibilidade por 100.000 perturbações dos pesos.
      </MethodNote>


      <ValidationMessage>{erro}</ValidationMessage>

      <StepCard numero="1" titulo="Configuração do problema" subtitulo="Defina a quantidade de alternativas e critérios que serão avaliados.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Quantidade de alternativas" type="number" value={numAlts} onChange={(e) => setNumAlts(Math.max(2, parseInt(e.target.value) || 2))} />
          <Input label="Quantidade de critérios" type="number" value={numCrit} onChange={(e) => setNumCrit(Math.max(2, parseInt(e.target.value) || 2))} />
        </div>
      </StepCard>

      <StepCard numero="2" titulo="Avaliação intercritério" subtitulo="Informe o peso de cada critério e marque se o critério deve ser maximizado ou minimizado.">
        <PesoTipoGrid nomesCrit={nomesCrit} pesos={pesos} tipos={tipos} onPeso={atualizarPeso} onTipo={alternarTipo} />
      </StepCard>

      <StepCard
  numero="3"
  titulo="Perfil de risco do decisor"
  subtitulo="Escolha como o decisor transforma desempenhos normalizados em utilidades intracritério."
>
  <div className="grid md:grid-cols-3 gap-4">
    {[
      {
        valor: 'averso',
        titulo: 'Averso ao risco',
        descricao: 'Usa função logarítmica côncava. Pequenos ganhos iniciais têm alta utilidade marginal.',
        formula: 'u(x) = ln(1 + kx) / ln(1 + k)',
      },
      {
        valor: 'neutro',
        titulo: 'Neutro ao risco',
        descricao: 'Usa função linear. A utilidade cresce proporcionalmente ao desempenho normalizado.',
        formula: 'u(x) = x',
      },
      {
        valor: 'propenso',
        titulo: 'Propenso ao risco',
        descricao: 'A MAUT calcula a utilidade global por agregação aditiva. A avaliação intercritério define os pesos dos critérios; a avaliação intracritério normaliza os desempenhos e aplica uma função de utilidade conforme o perfil de risco do decisor: averso, neutro ou propenso.',
        formula: 'U(a) = Σ wⱼ · uⱼ(a), com uⱼ(a) ajustada pelo perfil de risco'
      },
    ].map((opcao) => (
      <button
        key={opcao.valor}
        type="button"
        onClick={() => setPerfilRisco(opcao.valor)}
        className={`text-left rounded-2xl border p-5 transition ${
          perfilRisco === opcao.valor
            ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-900/20'
            : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'
        }`}
      >
        <div className="text-lg font-semibold text-white">{opcao.titulo}</div>
        <p className="mt-2 text-sm text-slate-300">{opcao.descricao}</p>
        <code className="mt-3 block text-xs text-teal-300">{opcao.formula}</code>
      </button>
    ))}
  </div>

  <div className="mt-6 max-w-md">
    <Input
      label="Intensidade da curvatura k"
      type="number"
      step="0.5"
      min="0.5"
      value={intensidadeRisco}
      onChange={(e) => setIntensidadeRisco(Math.max(0.5, Number(e.target.value) || 4))}
    />
    <p className="mt-2 text-sm text-slate-400">
      Quanto maior o valor de k, mais forte será a curvatura da função de utilidade. Para decisão prática, valores entre 2 e 6 costumam ser suficientes.
    </p>
  </div>
</StepCard>

<StepCard
  numero="4"
  titulo="Avaliação intracritério"
  subtitulo="Informe o desempenho das alternativas. A matriz será normalizada e depois transformada pela função de utilidade do perfil de risco escolhido."
>
  <Table
    numAlternativas={numAlts}
    numCriterios={numCrit}
    matriz={matriz}
    setMatriz={setMatriz}
    nomesAlternativas={nomesAlts}
    setNomesAlternativas={setNomesAlts}
    nomesCriterios={nomesCrit}
    setNomesCriterios={setNomesCrit}
  />
</StepCard>


      <ActionBar onExample={carregarExemplo} onCalculate={calcular} calculateLabel="Processar MAUT" />

      {resultado && (
        <StepCard numero="5" titulo="Resultado para o decisor" subtitulo="Ranking final, gráfico, pesos normalizados, robustez e utilidades intermediárias.">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
  <h3 className="text-lg font-semibold text-white">Função de utilidade aplicada na avaliação intracritério</h3>
  <p className="mt-2 text-sm text-slate-300">
    Perfil selecionado: <strong className="text-teal-300">{resultado.perfilRisco}</strong>. Intensidade da curvatura: <strong>{resultado.intensidade}</strong>.
  </p>
  <p className="mt-2 text-sm text-slate-400">
    Primeiro os desempenhos foram normalizados entre 0 e 1 conforme benefício ou custo. Em seguida, cada valor normalizado foi transformado pela função de utilidade do perfil de risco escolhido pelo decisor.
  </p>
</div>

            <RankingChart ranking={resultado.rankingNomeado} titulo="Ranking MAUT por utilidade global" scoreLabel="U(a)" />
            <div className="grid lg:grid-cols-2 gap-6">
              <PesosCriterios pesos={resultado.pesos} nomes={nomesCrit} />
              <SensitivityTable sensibilidade={sensibilidade} />
            </div>
            <MatrizResumo
  titulo="Avaliação intracritério: desempenhos normalizados antes da função de risco"
  linhas={nomesAlts}
  colunas={nomesCrit}
  matriz={resultado.utilidadesLineares}
/>

<MatrizResumo
  titulo="Avaliação intracritério: utilidades após perfil de risco uⱼ(a)"
  linhas={nomesAlts}
  colunas={nomesCrit}
  matriz={resultado.utilidades}
/>

<MatrizResumo
  titulo="Contribuições ponderadas wⱼ · uⱼ(a)"
  linhas={nomesAlts}
  colunas={nomesCrit}
  matriz={resultado.scores.map(item => item.contribuicoes)}
/>

          </div>
        </StepCard>
      )}
    </main>
  );
}
