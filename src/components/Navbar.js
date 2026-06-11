// src/components/Navbar.js
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Principal */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider text-teal-400 hover:text-teal-300 transition-colors no-underline">
              MCDM<span className="text-slate-100 font-light">.Analytics</span>
            </Link>
          </div>

          {/* Links de Navegação Atualizados com o Saiba Mais */}
          <div className="flex space-x-6 items-center">
            <Link href="/" className="text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors no-underline">
              Home
            </Link>
            <Link href="/blog" className="text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors no-underline">
              Saiba Mais
            </Link>
            <Link href="/artigos" className="text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors no-underline">
              Buscar Artigos
            </Link>
            <Link href="/calculadora" className="hover:text-teal-400 text-sm font-medium transition-colors px-4 py-2 rounded-lg bg-teal-600/10 text-teal-300 border border-teal-500/30 hover:bg-teal-600/20 no-underline">
              Calculadora MCDM
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}