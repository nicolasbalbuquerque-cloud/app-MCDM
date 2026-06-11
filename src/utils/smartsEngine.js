// src/utils/smartsEngine.js
import { calcularMAUT } from './mautEngine';

export const calcularPesosROC = (numCriterios) => {
  const pesos = Array(numCriterios).fill(0);
  for (let i = 0; i < numCriterios; i++) {
    let soma = 0;
    for (let k = i + 1; k <= numCriterios; k++) soma += 1 / k;
    pesos[i] = soma / numCriterios;
  }
  return pesos;
};

export const calcularSMARTS = (matriz, rankingCriterios, tipos) => {
  if (!matriz || !matriz.length || !matriz[0]) return { pesos: [], scores: [], ranking: [], pesosROC: [] };
  const numCrit = matriz[0].length;
  const pesosROC = calcularPesosROC(numCrit);
  const ordemValida = Array.from(new Set(rankingCriterios.filter(i => i >= 0 && i < numCrit)));
  Array.from({ length: numCrit }, (_, i) => i).forEach(i => {
    if (!ordemValida.includes(i)) ordemValida.push(i);
  });

  const pesosOrdenados = Array(numCrit).fill(0);
  ordemValida.forEach((criterioOriginal, posicaoNoRanking) => {
    pesosOrdenados[criterioOriginal] = pesosROC[posicaoNoRanking];
  });

  const resultado = calcularMAUT(matriz, pesosOrdenados, tipos);
  return {
    ...resultado,
    pesos: pesosOrdenados,
    pesosROC,
    ordemCriterios: ordemValida,
  };
};
