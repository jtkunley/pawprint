import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DemoResetControl } from './DemoResetControl';
import { PawIcon } from './PawIcon';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark">
              <PawIcon size={22} />
            </span>
            Pawprint
          </Link>
          <p className="site-header__tagline">Find a friend for life</p>
        </div>
      </header>

      <main id="main" className="container site-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Pawprint is a demo. Data lives in memory and is lost whenever the API restarts.</p>
          <DemoResetControl />
        </div>
      </footer>
    </div>
  );
}
