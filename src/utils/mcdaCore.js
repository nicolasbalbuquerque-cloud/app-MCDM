// src/utils/mcdaCore.js
export const EPS = 1e-12;

export const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const normalizarPesos = (pesos = [], tamanho = pesos.length) => {
  const valores = Array.from({ length: tamanho }, (_, i) => Math.max(0, toNumber(pesos[i], 0)));
  const soma = valores.reduce((acc, v) => acc + v, 0);
  if (soma <= EPS) return Array(tamanho).fill(1 / Math.max(1, tamanho));
  return valores.map(v => v / soma);
};

export const normalizarVetor = (vetor = []) => {
  const positivos = vetor.map(v => Math.max(0, toNumber(v, 0)));
  const soma = positivos.reduce((acc, v) => acc + v, 0);
  if (soma <= EPS) return Array(vetor.length).fill(1 / Math.max(1, vetor.length));
  return positivos.map(v => v / soma);
};

export const criarMatriz = (linhas, colunas, valor = 0) => (
  Array.from({ length: linhas }, () => Array.from({ length: colunas }, () => valor))
);

export const matrizNumerica = (matriz = []) => (
  matriz.map(linha => linha.map(valor => toNumber(valor, 0)))
);

export const calcularMinMax = (matriz = []) => {
  if (!matriz.length || !matriz[0]?.length) return { mins: [], maxs: [] };
  const dados = matrizNumerica(matriz);
  const numCrit = dados[0].length;
  const mins = Array(numCrit).fill(Infinity);
  const maxs = Array(numCrit).fill(-Infinity);

  for (let j = 0; j < numCrit; j++) {
    for (let i = 0; i < dados.length; i++) {
      mins[j] = Math.min(mins[j], dados[i][j]);
      maxs[j] = Math.max(maxs[j], dados[i][j]);
    }
  }

  return { mins, maxs };
};

export const utilidadeLinear = (valor, min, max, tipo = 'beneficio') => {
  const x = toNumber(valor, 0);
  if (Math.abs(max - min) <= EPS) return 1;
  if (tipo === 'custo') return (max - x) / (max - min);
  return (x - min) / (max - min);
};

export const normalizarMatrizUtilidade = (matriz = [], tipos = []) => {
  const dados = matrizNumerica(matriz);
  const { mins, maxs } = calcularMinMax(dados);
  const utilidades = dados.map(linha => linha.map((valor, j) => utilidadeLinear(valor, mins[j], maxs[j], tipos[j])));
  return { utilidades, mins, maxs };
};

export const ordenarPorScore = (scores = []) => (
  [...scores].sort((a, b) => {
    if (Math.abs(b.score - a.score) > EPS) return b.score - a.score;
    return a.id - b.id;
  }).map((item, index) => ({ ...item, posicao: index + 1 }))
);

export const nomearRanking = (ranking = [], nomes = []) => (
  ranking.map(item => ({ ...item, nome: nomes[item.id] || `Alternativa ${item.id + 1}` }))
);

export const multiplicarMatrizVetor = (matriz = [], vetor = []) => (
  matriz.map(linha => linha.reduce((acc, valor, j) => acc + toNumber(valor, 0) * toNumber(vetor[j], 0), 0))
);

export const criarGeradorAleatorio = (seed = 123456789) => {
  let estado = seed >>> 0;
  return () => {
    estado = (1664525 * estado + 1013904223) >>> 0;
    return (estado + 1) / 4294967297;
  };
};

export const perturbarPesos = (pesosBase = [], rng, intensidade = 0.55) => {
  const base = normalizarPesos(pesosBase, pesosBase.length);
  const perturbados = base.map(w => {
    const fator = Math.exp((rng() * 2 - 1) * intensidade);
    return Math.max(EPS, w * fator);
  });
  return normalizarPesos(perturbados, perturbados.length);
};

export const posicoesRanking = (scores = []) => {
  const ordenado = ordenarPorScore(scores.map((score, id) => ({ id, score })));
  const pos = Array(scores.length).fill(scores.length);
  ordenado.forEach(item => { pos[item.id] = item.posicao; });
  return pos;
};

export const calcularSensibilidadePesos = ({
  pesosBase,
  nomesAlternativas = [],
  calcularScores,
  iteracoes = 100000,
  intensidade = 0.55,
  seed = 20260611,
}) => {
  const nAlt = nomesAlternativas.length;
  if (!nAlt || typeof calcularScores !== 'function') return null;

  const rng = criarGeradorAleatorio(seed);
  const primeiro = Array(nAlt).fill(0);
  const somaPos = Array(nAlt).fill(0);
  const melhorPos = Array(nAlt).fill(Infinity);
  const piorPos = Array(nAlt).fill(-Infinity);
  const somaScore = Array(nAlt).fill(0);
  const minScore = Array(nAlt).fill(Infinity);
  const maxScore = Array(nAlt).fill(-Infinity);

  for (let s = 0; s < iteracoes; s++) {
    const pesos = perturbarPesos(pesosBase, rng, intensidade);
    const scores = calcularScores(pesos).map(v => toNumber(v, 0));
    const pos = posicoesRanking(scores);
    for (let i = 0; i < nAlt; i++) {
      if (pos[i] === 1) primeiro[i] += 1;
      somaPos[i] += pos[i];
      melhorPos[i] = Math.min(melhorPos[i], pos[i]);
      piorPos[i] = Math.max(piorPos[i], pos[i]);
      somaScore[i] += scores[i];
      minScore[i] = Math.min(minScore[i], scores[i]);
      maxScore[i] = Math.max(maxScore[i], scores[i]);
    }
  }

  const resumo = Array.from({ length: nAlt }, (_, id) => ({
    id,
    nome: nomesAlternativas[id] || `Alternativa ${id + 1}`,
    probPrimeiro: primeiro[id] / iteracoes,
    rankMedio: somaPos[id] / iteracoes,
    melhorPosicao: melhorPos[id],
    piorPosicao: piorPos[id],
    scoreMedio: somaScore[id] / iteracoes,
    scoreMin: minScore[id],
    scoreMax: maxScore[id],
  })).sort((a, b) => {
    if (Math.abs(b.probPrimeiro - a.probPrimeiro) > EPS) return b.probPrimeiro - a.probPrimeiro;
    return a.rankMedio - b.rankMedio;
  });

  return { iteracoes, intensidade, resumo };
};
