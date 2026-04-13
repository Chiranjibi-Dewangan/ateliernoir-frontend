function Legend({ items }) {
  return (
    <section className="legend" aria-label="Wheel legend">
      {items.map((item) => (
        <article key={item.id} className="legend-item">
          <span className="legend-swatch" style={{ background: item.color }} aria-hidden="true" />
          <div>
            <strong>{item.label}</strong>
            <p>{item.meaning}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default Legend;
