// src/utils/fitradeoffengine.js
import { criarGeradorAleatorio, EPS, normalizarMatrizUtilidade, normalizarPesos, ordenarPorScore } from './mcdaCore';

const amostrarDirichletUniforme = (n, rng) => {
  const valores = Array.from({ length: n }, () => -Math.log(Math.max(EPS, rng())));
  return normalizarPesos(valores, n);
};

const atendeRestricoes = (pesos, restricoes, tolerancia) => restricoes.every(r => {
  if (r.relacao === 'a') return pesos[r.a] + EPS >= pesos[r.b];
  if (r.relacao === 'b') return pesos[r.b] + EPS >= pesos[r.a];
  if (r.relacao === 'indiferente') return Math.abs(pesos[r.a] - pesos[r.b]) <= tolerancia;
  return true;
});

export const gerarAmostrasPesosViaveis = ({ numCrit, restricoes = [], iteracoes = 100000, seed = 20260611 }) => {
  const tolerancias = [0.015, 0.03, 0.06, 0.10, 0.18];
  for (const tolerancia of tolerancias) {
    const rng = criarGeradorAleatorio(seed);
    const amostras = [];
    for (let i = 0; i < iteracoes; i++) {
      const pesos = amostrarDirichletUniforme(numCrit, rng);
      if (atendeRestricoes(pesos, restricoes, tolerancia)) amostras.push(pesos);
    }
    if (amostras.length >= Math.max(100, Math.floor(iteracoes * 0.002))) {
      return { amostras, tolerancia, iteracoes, taxaAceitacao: amostras.length / iteracoes };
    }
  }
  return { amostras: [Array(numCrit).fill(1 / numCrit)], tolerancia: null, iteracoes, taxaAceitacao: 0, fallback: true };
};

export const calcularFITradeoff = (matriz, respostas = [], tipos = [], opcoes = {}) => {
  if (!matriz || !matriz.length || !matriz[0]) return { pesos: [], scores: [], ranking: [] };
  const numAlt = matriz.length;
  const numCrit = matriz[0].length;
  const iteracoes = opcoes.iteracoes || 100000;
  const restricoes = respostas.filter(r => ['a', 'b', 'indiferente'].includes(r.relacao));
  const { utilidades, mins, maxs } = normalizarMatrizUtilidade(matriz, tipos);
  const amostragem = gerarAmostrasPesosViaveis({ numCrit, restricoes, iteracoes, seed: opcoes.seed || 20260611 });

  const somaPesos = Array(numCrit).fill(0);
  const minPeso = Array(numCrit).fill(Infinity);
  const maxPeso = Array(numCrit).fill(-Infinity);
  const somaScore = Array(numAlt).fill(0);
  const minScore = Array(numAlt).fill(Infinity);
  const maxScore = Array(numAlt).fill(-Infinity);
  const primeiro = Array(numAlt).fill(0);
  const somaPos = Array(numAlt).fill(0);
  const melhorPos = Array(numAlt).fill(Infinity);
  const piorPos = Array(numAlt).fill(-Infinity);

  amostragem.amostras.forEach(pesos => {
    pesos.forEach((w, j) => {
      somaPesos[j] += w;
      minPeso[j] = Math.min(minPeso[j], w);
      maxPeso[j] = Math.max(maxPeso[j], w);
    });

    const scoresAmostra = utilidades.map(linha => linha.reduce((acc, u, j) => acc + u * pesos[j], 0));
    const ordenado = ordenarPorScore(scoresAmostra.map((score, id) => ({ id, score })));
    const pos = Array(numAlt).fill(numAlt);
    ordenado.forEach(item => { pos[item.id] = item.posicao; });

    for (let i = 0; i < numAlt; i++) {
      somaScore[i] += scoresAmostra[i];
      minScore[i] = Math.min(minScore[i], scoresAmostra[i]);
      maxScore[i] = Math.max(maxScore[i], scoresAmostra[i]);
      if (pos[i] === 1) primeiro[i] += 1;
      somaPos[i] += pos[i];
      melhorPos[i] = Math.min(melhorPos[i], pos[i]);
      piorPos[i] = Math.max(piorPos[i], pos[i]);
    }
  });

  const nAmostras = amostragem.amostras.length;
  const pesos = somaPesos.map(v => v / nAmostras);
  const scores = Array.from({ length: numAlt }, (_, id) => ({
    id,
    score: somaScore[id] / nAmostras,
    scoreMin: minScore[id],
    scoreMax: maxScore[id],
    probPrimeiro: primeiro[id] / nAmostras,
    rankMedio: somaPos[id] / nAmostras,
    melhorPosicao: melhorPos[id],
    piorPosicao: piorPos[id],
  }));

  return {
    pesos,
    intervalosPesos: pesos.map((_, j) => ({ min: minPeso[j], max: maxPeso[j] })),
    utilidades,
    mins,
    maxs,
    scores,
    ranking: ordenarPorScore(scores),
    sensibilidade: {
      iteracoes: amostragem.iteracoes,
      resumo: scores.map(item => ({ ...item })).sort((a, b) => b.probPrimeiro - a.probPrimeiro || a.rankMedio - b.rankMedio),
    },
    amostragem,
    restricoes,
  };
};
