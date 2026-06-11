// src/utils/topsisEngine.js
import { EPS, matrizNumerica, normalizarPesos, ordenarPorScore, toNumber } from './mcdaCore';

export const calcularTOPSIS = (matriz, pesos, tipos) => {
  if (!matriz || matriz.length === 0 || !matriz[0]) return { pesos: [], scores: [], ranking: [] };
  const dados = matrizNumerica(matriz);
  const numAlts = dados.length;
  const numCrit = dados[0].length;
  const pesosNormalizados = normalizarPesos(pesos, numCrit);

  const denominadores = Array(numCrit).fill(0);
  for (let j = 0; j < numCrit; j++) {
    denominadores[j] = Math.sqrt(dados.reduce((acc, row) => acc + Math.pow(toNumber(row[j], 0), 2), 0));
    if (denominadores[j] <= EPS) denominadores[j] = 1;
  }

  const matrizNormalizada = dados.map(row => row.map((valor, j) => valor / denominadores[j]));
  const matrizPonderada = matrizNormalizada.map(row => row.map((valor, j) => valor * pesosNormalizados[j]));

  const idealPositiva = Array(numCrit).fill(0);
  const idealNegativa = Array(numCrit).fill(0);
  for (let j = 0; j < numCrit; j++) {
    const col = matrizPonderada.map(row => row[j]);
    if (tipos[j] === 'custo') {
      idealPositiva[j] = Math.min(...col);
      idealNegativa[j] = Math.max(...col);
    } else {
      idealPositiva[j] = Math.max(...col);
      idealNegativa[j] = Math.min(...col);
    }
  }

  const scores = matrizPonderada.map((linha, id) => {
    const contribuicaoPositiva = linha.map((valor, j) => Math.pow(valor - idealPositiva[j], 2));
    const contribuicaoNegativa = linha.map((valor, j) => Math.pow(valor - idealNegativa[j], 2));
    const dPositiva = Math.sqrt(contribuicaoPositiva.reduce((acc, v) => acc + v, 0));
    const dNegativa = Math.sqrt(contribuicaoNegativa.reduce((acc, v) => acc + v, 0));
    const denom = dPositiva + dNegativa;
    const score = denom <= EPS ? 0.5 : dNegativa / denom;
    return { id, score, dPositiva, dNegativa, contribuicaoPositiva, contribuicaoNegativa };
  });

  return {
    pesos: pesosNormalizados,
    denominadores,
    matrizNormalizada,
    matrizPonderada,
    idealPositiva,
    idealNegativa,
    scores,
    ranking: ordenarPorScore(scores),
  };
};
