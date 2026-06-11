// src/utils/mautEngine.js
import { normalizarPesos, ordenarPorScore } from './mcdaCore';

const limitar01 = (valor) => Math.min(1, Math.max(0, Number(valor) || 0));

export const normalizarMAUT = (valor, min, max, tipo) => {
  if (max === min) return 1;

  const normalizado = tipo === 'custo'
    ? (max - valor) / (max - min)
    : (valor - min) / (max - min);

  return limitar01(normalizado);
};

export const funcaoUtilidadeRisco = (valorNormalizado, perfilRisco = 'neutro', intensidade = 4) => {
  const x = limitar01(valorNormalizado);
  const k = Math.max(0.1, Number(intensidade) || 4);

  if (perfilRisco === 'averso') {
    return Math.log1p(k * x) / Math.log1p(k);
  }

  if (perfilRisco === 'propenso') {
    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const minimo = sigmoid(-k / 2);
    const maximo = sigmoid(k / 2);
    const valor = sigmoid(k * (x - 0.5));

    return limitar01((valor - minimo) / (maximo - minimo));
  }

  return x;
};

export const normalizarMatrizMAUTComRisco = (matriz, tipos, perfilRisco = 'neutro', intensidade = 4) => {
  const numCrit = matriz[0]?.length || 0;
  const mins = [];
  const maxs = [];

  for (let j = 0; j < numCrit; j += 1) {
    const coluna = matriz.map((linha) => Number(linha[j]) || 0);
    mins[j] = Math.min(...coluna);
    maxs[j] = Math.max(...coluna);
  }

  const utilidadesLineares = matriz.map((linha) =>
    linha.map((valor, j) => normalizarMAUT(Number(valor) || 0, mins[j], maxs[j], tipos[j]))
  );

  const utilidades = utilidadesLineares.map((linha) =>
    linha.map((u) => funcaoUtilidadeRisco(u, perfilRisco, intensidade))
  );

  return {
    utilidades,
    utilidadesLineares,
    mins,
    maxs,
    perfilRisco,
    intensidade,
  };
};

export const calcularMAUT = (matriz, pesos, tipos, perfilRisco = 'neutro', intensidade = 4) => {
  if (!matriz || matriz.length === 0 || !matriz[0]) {
    return {
      pesos: [],
      utilidades: [],
      utilidadesLineares: [],
      scores: [],
      ranking: [],
      perfilRisco,
      intensidade,
    };
  }

  const numCrit = matriz[0].length;
  const pesosNormalizados = normalizarPesos(pesos, numCrit);

  const {
    utilidades,
    utilidadesLineares,
    mins,
    maxs,
  } = normalizarMatrizMAUTComRisco(matriz, tipos, perfilRisco, intensidade);

  const scores = utilidades.map((linha, id) => {
    const contribuicoes = linha.map((u, j) => u * pesosNormalizados[j]);
    const score = contribuicoes.reduce((acc, v) => acc + v, 0);

    return {
      id,
      score,
      utilidades: linha,
      utilidadesLineares: utilidadesLineares[id],
      contribuicoes,
    };
  });

  return {
    pesos: pesosNormalizados,
    utilidades,
    utilidadesLineares,
    mins,
    maxs,
    scores,
    ranking: ordenarPorScore(scores),
    perfilRisco,
    intensidade,
  };
};
