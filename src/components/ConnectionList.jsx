function ConnectionList({ title = "Connected sections", relatedNodes, onSelect }) {
  if (!relatedNodes.length) {
    return null;
  }

  return (
    <section className="panel-section">
      <h3>{title}</h3>
      <div className="connection-list">
        {relatedNodes.map((node) => (
          <button key={node.id} type="button" className="connection-chip" onClick={() => onSelect(node.id)}>
            <span>{node.shortLabel}</span>
            <small>{node.shortDescription}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ConnectionList;
