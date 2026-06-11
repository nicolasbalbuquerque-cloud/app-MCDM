// src/components/ui/Table.js
export default function Table({ 
  numAlternativas, 
  numCriterios, 
  matriz, 
  setMatriz, 
  nomesAlternativas, 
  setNomesAlternativas, 
  nomesCriterios, 
  setNomesCriterios 
}) {
  const atualizarCelulaMatriz = (linha, coluna, valor) => {
    const numero = valor === '' ? '' : Number(valor);
    const novaMatriz = matriz.map((r, i) => 
      r.map((c, j) => (i === linha && j === coluna ? (Number.isFinite(numero) ? numero : 0) : c))
    );
    setMatriz(novaMatriz);
  };
  const atualizarNomeAlternativa = (index, valor) => {
    const novosNomes = [...nomesAlternativas];
    novosNomes[index] = valor;
    setNomesAlternativas(novosNomes);
  };
  const atualizarNomeCriterio = (index, valor) => {
    const novosNomes = [...nomesCriterios];
    novosNomes[index] = valor;
    setNomesCriterios(novosNomes);
  };
  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/40 shadow-2xl shadow-slate-950/20">
      <table className="w-full border-collapse text-left text-sm text-slate-300">
        <thead className="bg-slate-900 text-slate-200">
          <tr>
            <th className="p-4 font-bold border-b border-slate-800 text-teal-400">Alternativas / Critérios</th>
            {Array.from({ length: numCriterios }).map((_, j) => (
              <th key={j} className="p-4 border-b border-slate-800 min-w-[150px]">
                <input
                  type="text"
                  value={nomesCriterios[j] || ''}
                  onChange={(e) => atualizarNomeCriterio(j, e.target.value)}
                  placeholder={`Critério ${j + 1}`}
                  className="bg-transparent font-bold text-teal-400 border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none w-full"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {Array.from({ length: numAlternativas }).map((_, i) => (
            <tr key={i} className="hover:bg-slate-900/30 transition-colors">
              <td className="p-4 font-medium border-r border-slate-800 bg-slate-900/10 min-w-[180px]">
                <input
                  type="text"
                  value={nomesAlternativas[i] || ''}
                  onChange={(e) => atualizarNomeAlternativa(i, e.target.value)}
                  placeholder={`Alternativa ${i + 1}`}
                  className="bg-transparent font-semibold text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none w-full"
                />
              </td>
              {Array.from({ length: numCriterios }).map((_, j) => (
                <td key={j} className="p-2">
                  <input
                    type="number"
                    step="any"
                    value={matriz[i]?.[j] ?? ''}
                    onChange={(e) => atualizarCelulaMatriz(i, j, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:border-teal-500 text-right"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
