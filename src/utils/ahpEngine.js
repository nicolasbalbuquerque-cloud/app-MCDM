// src/utils/ahpEngine.js
import { EPS, multiplicarMatrizVetor, normalizarVetor, ordenarPorScore, toNumber } from './mcdaCore';

const RI = {
  1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32,
  8: 1.41, 9: 1.45, 10: 1.49, 11: 1.51, 12: 1.48, 13: 1.56, 14: 1.57, 15: 1.59,
};

export const escalaSaaty = [
  { valor: 1 / 9, label: '1/9 - Coluna é extremamente preferível' },
  { valor: 1 / 7, label: '1/7 - Coluna é muito fortemente preferível' },
  { valor: 1 / 5, label: '1/5 - Coluna é fortemente preferível' },
  { valor: 1 / 3, label: '1/3 - Coluna é moderadamente preferível' },
  { valor: 1, label: '1 - Igual importância/preferência' },
  { valor: 3, label: '3 - Linha é moderadamente preferível' },
  { valor: 5, label: '5 - Linha é fortemente preferível' },
  { valor: 7, label: '7 - Linha é muito fortemente preferível' },
  { valor: 9, label: '9 - Linha é extremamente preferível' },
];

export const criarMatrizParitaria = (n) => (
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 1)))
);

export const processarMatrizAHP = (matrizParitaria = []) => {
  const n = matrizParitaria.length;
  if (!n) return { pesos: [], consistente: true, CR: 0, CI: 0, lambdaMax: 0, avisos: [] };

  const matriz = matrizParitaria.map((linha, i) => linha.map((valor, j) => {
    if (i === j) return 1;
    return Math.max(EPS, toNumber(valor, 1));
  }));

  let pesos = Array(n).fill(1 / n);
  for (let it = 0; it < 200; it++) {
    const produto = multiplicarMatrizVetor(matriz, pesos);
    const novos = normalizarVetor(produto);
    const erro = novos.reduce((acc, v, i) => acc + Math.abs(v - pesos[i]), 0);
    pesos = novos;
    if (erro < 1e-10) break;
  }

  const aw = multiplicarMatrizVetor(matriz, pesos);
  const lambdaMax = aw.reduce((acc, v, i) => acc + v / Math.max(EPS, pesos[i]), 0) / n;
  const CI = n <= 2 ? 0 : (lambdaMax - n) / (n - 1);
  const valorRI = RI[n] ?? RI[15];
  const CR = valorRI > 0 ? CI / valorRI : 0;
  const consistente = n <= 2 || CR <= 0.10;

  const somaColunas = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) somaColunas[j] += matriz[i][j];
  }
  const matrizNormalizada = matriz.map(linha => linha.map((valor, j) => valor / Math.max(EPS, somaColunas[j])));

  return {
    pesos,
    consistente,
    CR: Number(Math.max(0, CR).toFixed(4)),
    CI: Number(Math.max(0, CI).toFixed(4)),
    lambdaMax: Number(lambdaMax.toFixed(6)),
    matrizNormalizada,
    vetorPonderado: aw,
  };
};

export const calcularAHPCompleto = ({ matrizCriterios = [], matrizesAlternativas = [] }) => {
  const criterios = processarMatrizAHP(matrizCriterios);
  const numCrit = criterios.pesos.length;
  const numAlt = matrizesAlternativas?.[0]?.length || 0;

  const locais = Array.from({ length: numCrit }, (_, j) => processarMatrizAHP(matrizesAlternativas[j] || criarMatrizParitaria(numAlt)));
  const scores = Array.from({ length: numAlt }, (_, idAlt) => {
    const contribuicoes = Array.from({ length: numCrit }, (_, j) => criterios.pesos[j] * (locais[j]?.pesos[idAlt] || 0));
    const score = contribuicoes.reduce((acc, v) => acc + v, 0);
    return { id: idAlt, score, contribuicoes, prioridadesLocais: locais.map(res => res.pesos[idAlt] || 0) };
  });

  return {
    criterios,
    locais,
    scores,
    ranking: ordenarPorScore(scores),
    consistenteGlobal: criterios.consistente && locais.every(res => res.consistente),
  };
};
