import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="page-shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="brand-row">
          <img className="brand-logo" src="/Octocat.png" alt="Octocat do GitHub" />
          <div>
            <p className="eyebrow">SEU LABORATÓRIO DE CÓDIGO</p>
            <p className="brand-name">Codespaces <span>×</span> React</p>
          </div>
        </header>

        <div className="intro">
          <p className="section-label">UM COMEÇO PRONTO PARA VOCÊ</p>
          <h1 id="page-title">Experimente. Mude. Crie.</h1>
          <p className="intro-copy">
            Este espaço já está preparado para o próximo passo. Edite{' '}
            <code>src/App.jsx</code> e veja sua ideia ganhar vida.
          </p>
        </div>

        <section className="counter-card" aria-labelledby="counter-title">
          <div className="counter-heading">
            <span className="counter-icon" aria-hidden="true">↗</span>
            <div>
              <h2 id="counter-title">Contador de cliques</h2>
              <p>Uma pequena experiência com estado no React.</p>
            </div>
          </div>

          <output className="counter-value" aria-live="polite" aria-atomic="true">
            {count}
          </output>

          <div className="counter-actions">
            <button className="button button-primary" type="button" onClick={() => setCount((value) => value + 1)}>
              Contar mais
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setCount(0)}
              disabled={count === 0}
            >
              Zerar
            </button>
          </div>
        </section>

        <nav className="resource-links" aria-label="Materiais para começar">
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            Learn React <span aria-hidden="true">↗</span>
          </a>
          <a href="https://docs.github.com/pt/codespaces" target="_blank" rel="noreferrer">
            Guia do Codespaces <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <footer className="workspace-footer">
          <span><span className="status-dot" aria-hidden="true" /> Ambiente pronto</span>
          <span>Feito para aprender fazendo</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
