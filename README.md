# MCDM.Analytics 📊

Uma aplicação web de **Divulgação Científica e Engenharia de Decisão** desenvolvida em Next.js e Tailwind CSS. O objetivo da plataforma é centralizar o conhecimento sobre **Apoio Multicritério à Decisão (MCDM/A)**, conectando teoria matemática, busca científica e ferramentas práticas em um só lugar.

---

## 🖥️ O que a aplicação faz?

A plataforma foi dividida em três pilares fundamentais para o usuário:

### 1. Hub de Divulgação Científica (Blog)
Um espaço dedicado a desmistificar a Pesquisa Operacional. Explica de forma clara as principais vertentes da área:
* **Escola Americana (Compensatória):** Métodos que agregam preferências em uma função de utilidade global (ex: MAUT, AHP).
* **Escola Europeia (Não-Compensatória):** Métodos baseados em relações de sobreclassificação para lidar com critérios conflitantes (ex: ELECTRE, PROMETHEE).
* **Histórico de Pioneiros:** Uma tabela estruturada mapeando os 10 maiores pesquisadores do mundo na área e suas contribuições.

### 2. Busca de Trabalhos Científicos
Um sistema de direcionamento integrado para que estudantes, pesquisadores e engenheiros consigam **buscar, filtrar e acessar artigos científicos**, dissertações e aplicações reais de métodos multicritério na literatura internacional.

### 3. Calculadora Interativa de Métodos Multicritério
A aplicação conta com um módulo utilitário (Calculadora) projetado para rodar algoritmos de tomada de decisão direto no navegador. Ela permite ao usuário:
* Inserir alternativas e critérios técnicos.
* Atribuir pesos e preferências.
* Processar cálculos e visualizar a ordenação ou seleção ideal das alternativas com rigor matemático.

---

## 🛠️ Tecnologias Utilizadas

* **Next.js (App Router)** – Roteamento de alta performance baseado em arquivos, utilizando renderização híbrida.
* **Tailwind CSS** – Interface moderna construída inteiramente em *Dark Mode* responsivo.
* **React (Hooks)** – Manipulação dinâmica do DOM no cliente para o funcionamento reativo da calculadora e tratamento de scroll por âncoras.

---

## 🚀 Como Executar Localmente

1. Clonar o repositório:
   ```bash
   git clone [https://github.com/nicolasbalbuquerque-cloud/Blog-Nextjs.git](https://github.com/nicolasbalbuquerque-cloud/Blog-Nextjs.git)
   Instalar as dependências:

2. Bash
    npm install
    Rodar o servidor de desenvolvimento:

3.    Bash
    npm run dev

4. Acesse: http://localhost:3000