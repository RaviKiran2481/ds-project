import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import CommandPalette from '../components/SearchBar/CommandPalette.jsx';
import { useMediaQuery } from '../hooks/index.js';
import { useTheme } from '../context/ThemeContext.jsx';

const Background3D = lazy(() => import('../components/Background3D/Background3D.jsx'));

export default function MainLayout({ children }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {isDesktop && !reducedMotion && (
        <Suspense fallback={null}>
          <Background3D light={theme === 'light'} />
        </Suspense>
      )}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn-primary">
        Skip to content
      </a>
      <Header onOpenSearch={() => setPaletteOpen(true)} />
      <main id="main" className="relative mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
