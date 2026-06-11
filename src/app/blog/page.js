// src/app/blog/page.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogMCDM() {
  // Efeito para corrigir a rolagem de âncoras (#) no Next.js
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Pequeno delay para garantir que o DOM foi totalmente renderizado
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const pesquisadores = [
    { nome: "Thomas L. Saaty", contrib: "Criador do AHP (Analytic Hierarchy Process) e posteriormente do ANP (Analytic Network Process). O AHP é o método multicritério mais utilizado globalmente." },
    { nome: "Bernard Roy", contrib: "Fundador da escola europeia de MCDA e criador da família ELECTRE, introduzindo as relações de sobreclassificação baseadas em pseudocritérios." },
    { nome: "Ralph L. Keeney", contrib: "Um dos pais da MAUT (Multi-Attribute Utility Theory) e criador da abordagem Value-Focused Thinking (VFT) para estruturação de objetivos." },
    { nome: "Howard Raiffa", contrib: "Coautor de Decisions with Multiple Objectives, obra fundacional da teoria multicritério sob a ótica de utilidade e risco." },
    { nome: "Jean-Pierre Brans", contrib: "Criador da família PROMETHEE, um dos métodos de sobreclassificação mais aplicados para ordenação e seleção multicritério." },
    { nome: "Adiel T. de Almeida", contrib: "Expoente internacional brasileiro e desenvolvedor do método FITradeoff, reduzindo drasticamente o esforço cognitivo via informação parcial." },
    { nome: "Jyrki Wallenius", contrib: "Contribuições fundamentais em programação multiobjetivo, elicitação interativa de preferências e evolução histórica da área." },
    { nome: "Stanley Zionts", contrib: "Pioneiro no desenvolvimento de métodos interativos para otimização multiobjetivo e coautor de registros históricos da evolução da PO." },
    { nome: "Valerie Belton", contrib: "Referência mundial na integração entre MCDA, abordagens de estruturação de problemas (PSM) e facilitação de processos decisórios." },
    { nome: "Theodor J. Stewart", contrib: "Grande autoridade em análise de robustez, modelagem de cenários e integração metodológica de suporte à decisão." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 scroll-smooth">
      <main className="max-w-4xl mx-auto px-6">
        
        {/* Botão Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm font-bold gap-2 mb-10 no-underline transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Voltar para a Home
        </Link>

        <article className="space-y-12">
          
          {/* SEÇÃO 1: O que é Multicritério */}
          <section id="fundamentos" className="animate-fadeIn scroll-mt-20">
            <h1 className="text-3xl font-extrabold text-teal-400 mb-6 tracking-tight">
              O que é Apoio Multicritério à Decisão (MCDM/A)?
            </h1>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              O Multicriteria Decision Making/Analysis (MCDM/A) constitui um dos ramos mais consolidados da Pesquisa Operacional, dedicado à estruturação, modelagem e apoio à resolução de problemas complexos de decisão caracterizados pela presença simultânea de múltiplos critérios, frequentemente conflitantes, incomensuráveis e sujeitos a diferentes níveis de incerteza.
            </p>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              Diferentemente de abordagens baseadas exclusivamente na intuição ou na análise unidimensional, o MCDM/A fornece um arcabouço metodológico rigoroso para representar preferências, explicitar trade-offs e tornar o processo decisório transparente, rastreável e defensável. Seu desenvolvimento histórico resultou em duas grandes correntes metodológicas: a Escola Americana, fundamentada em modelos compensatórios e na agregação de preferências por meio de funções de valor ou utilidade global, representada por métodos como MAUT (Multi-Attribute Utility Theory) e AHP (Analytic Hierarchy Process); e a Escola Europeia, baseada em relações de sobreclassificação (outranking), que admite a coexistência de conflitos e incomparabilidades entre alternativas, sendo representada por métodos como ELECTRE e PROMETHEE.
            </p>
            <p className="text-base text-slate-300 leading-relaxed">
              Em termos formais, a modelagem multicritério estabelece uma relação entre um conjunto de alternativas e um conjunto de critérios, avaliando o desempenho de cada alternativa em relação aos objetivos do decisor. A partir dessa estrutura, são produzidas recomendações, classificações, ordenações ou seleções de alternativas, acompanhadas por análises de sensibilidade e robustez que permitem avaliar a estabilidade das soluções frente a variações nos parâmetros do modelo.
            </p>
          </section>

          <hr className="border-slate-900" />

          {/* SEÇÃO 2: Aplicações Interdisciplinares */}
          <section id="aplicacoes" className="space-y-4 scroll-mt-20">
            <h2 className="text-3xl font-extrabold text-teal-400 mb-6 tracking-tight">
              Aplicações do MCDM/A em Diferentes Áreas do Conhecimento
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              A versatilidade do Multicriteria Decision Making/Analysis (MCDM/A) tem impulsionado sua adoção em uma ampla variedade de setores, especialmente em contextos onde decisões estratégicas envolvem múltiplos objetivos, restrições e interesses conflitantes. Ao permitir a integração sistemática de critérios quantitativos e qualitativos, os métodos multicritério fornecem suporte estruturado para problemas complexos que dificilmente poderiam ser tratados por abordagens tradicionais de otimização ou análise unidimensional.
            </p>

            <div className="space-y-4 pt-4 text-sm text-slate-400">
              <p>
                <strong className="text-slate-200">Na engenharia:</strong> O MCDM/A é amplamente utilizado para seleção de materiais, priorização de projetos, planejamento de manutenção, avaliação de riscos e escolha de tecnologias. Em sistemas de infraestrutura crítica, por exemplo, critérios como custo, confiabilidade, resiliência, impacto ambiental e tempo de recuperação podem ser considerados simultaneamente para apoiar decisões mais robustas.
              </p>
              <p>
                <strong className="text-slate-200">No campo da gestão e administração:</strong> Métodos multicritério auxiliam na seleção de fornecedores, avaliação de desempenho organizacional, análise de investimentos, gestão de portfólio de projetos e definição de estratégias corporativas. A capacidade de incorporar preferências dos tomadores de decisão torna essas abordagens particularmente úteis em ambientes empresariais caracterizados por incerteza e múltiplos stakeholders.
              </p>
              <p>
                <strong className="text-slate-200">Na área de transportes e logística:</strong> É empregado para localização de centros de distribuição, definição de rotas, seleção de modais de transporte, avaliação de cadeias de suprimentos e planejamento de sistemas urbanos de mobilidade. Critérios econômicos, operacionais, ambientais e sociais podem ser avaliados simultaneamente para promover soluções equilibradas e sustentáveis.
              </p>
              <p>
                <strong className="text-slate-200">Em saúde:</strong> Os métodos multicritério têm sido utilizados para priorização de pacientes, avaliação de tecnologias médicas, seleção de tratamentos, alocação de recursos hospitalares e formulação de políticas públicas. Nesses contextos, aspectos clínicos, econômicos, éticos e sociais frequentemente precisam ser conciliados durante o processo decisório.
              </p>
              <p>
                <strong className="text-slate-200">Na gestão ambiental:</strong> Apoia decisões relacionadas à conservação de recursos naturais, gestão de resíduos, avaliação de impactos ambientais, seleção de fontes de energia renovável e planejamento territorial. A natureza multidimensional dos problemas ambientais torna a abordagem multicritério especialmente adequada para equilibrar desenvolvimento econômico, preservação ambiental e bem-estar social.
              </p>
              <p>
                <strong className="text-slate-200">No setor de energia:</strong> Aplicações incluem planejamento da expansão de sistemas elétricos, seleção de matrizes energéticas, avaliação de fontes renováveis e priorização de investimentos em infraestrutura. Critérios como custo, confiabilidade, segurança energética, econômicas e aceitação social são frequentemente considerados em conjunto.
              </p>
              <p>
                <strong className="text-slate-200">Em segurança e defesa:</strong> Métodos multicritério são empregados para avaliação de ameaças, seleção de equipamentos, análise de cenários estratégicos e priorização de ações de resposta a emergências. A necessidade de considerar simultaneamente fatores operacionais, econômicos e estratégicos torna essas metodologias particularmente valiosas.
              </p>
              <p>
                <strong className="text-slate-200">Em Inteligência Artificial e Ciência de Dados:</strong> Mais recentemente, o MCDM/A tem sido integrado a áreas emergentes e sistemas inteligentes, sendo utilizado para seleção de modelos de aprendizado de máquina, avaliação de algoritmos, explicabilidade de sistemas e apoio à tomada de decisão automatizada. A combinação entre técnicas multicritério e métodos computacionais avançados tem ampliado significativamente o potencial dessas abordagens em ambientes complexos e dinâmicos.
              </p>
            </div>

            <p className="text-base text-slate-300 leading-relaxed pt-2">
              Dessa forma, o MCDM/A consolidou-se como uma das principais ferramentas de apoio à decisão em contextos multidimensionais, contribuindo para a obtenção de soluções mais transparentes, justificáveis e alinhadas aos objetivos dos decisores e das organizações.
            </p>
          </section>

          <hr className="border-slate-900" />

          {/* SEÇÃO 3: Tabela de Pesquisadores */}
          <section id="pesquisadores" className="scroll-mt-20">
            <h2 className="text-3xl font-extrabold text-teal-400 mb-6 tracking-tight">
              Os Grandes Pesquisadores da Área Científica
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-6">
              A robustez matemática e a maturidade dos algoritmos de decisão aplicados na literatura internacional contemporânea derivam do legado conceitual estabelecido por pesquisadores pioneiros:
            </p>
            
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/20 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="p-4 text-sm font-bold text-teal-400 tracking-wider w-1/4">Pesquisador</th>
                    <th className="p-4 text-sm font-bold text-teal-400 tracking-wider w-3/4">Principal Contribuição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-sm">
                  {pesquisadores.map((p, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-900/30 transition-colors ${
                        p.nome.includes("Almeida") ? "bg-teal-500/5" : ""
                      }`}
                    >
                      <td className={`p-4 font-bold border-r border-slate-900/50 ${
                        p.nome.includes("Almeida") ? "text-teal-400" : "text-slate-200"
                      }`}>
                        {p.nome}
                      </td>
                      <td className="p-4 text-slate-400 leading-relaxed">
                        {p.contrib}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </article>
      </main>
    </div>
  );
}