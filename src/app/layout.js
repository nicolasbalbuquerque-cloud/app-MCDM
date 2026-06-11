// src/app/layout.js
import './globals.css'; 
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'MCDM Analytics - Suporte à Decisão em Infraestrutura',
  description: 'Plataforma de análise multicritério para resiliência urbana e alagamentos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className="dark scroll-smooth" suppressHydrationWarning>
  <body
    suppressHydrationWarning
    className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-teal-500/30"
  >
        <Navbar />
        <div className="min-h-[calc(100vh-160px)]">
          {children}
        </div>
        <footer className="border-t border-slate-900 py-10 text-center text-slate-500 text-xs tracking-wide bg-slate-950">
          <p>© {new Date().getFullYear()} MCDM.Analytics • Pesquisa Científica & Resiliência Urbana</p>
        </footer>
      </body>
    </html>
  );
}