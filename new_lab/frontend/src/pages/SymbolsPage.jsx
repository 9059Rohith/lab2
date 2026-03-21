import { SYMBOL_REFERENCE } from '../data/assetsData';

export default function SymbolsPage() {
  return (
    <section className="page-wrap symbols-page">
      <header className="symbols-hero">
        <p className="kicker">Symbol Reference Grid</p>
        <h2>All Math Symbols With Meaning</h2>
        <p className="small">Tap and read each symbol card for quick learning support.</p>
      </header>

      <div className="symbols-grid">
        {SYMBOL_REFERENCE.map((item) => (
          <article key={item.symbol} className="symbol-card">
            <div className="symbol-glyph">{item.symbol}</div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
