function GlossaryItem({ item }) {
  return (
    <article className="glossary-item">
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </article>
  );
}

export default GlossaryItem;
