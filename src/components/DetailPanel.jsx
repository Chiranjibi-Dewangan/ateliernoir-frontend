import ConnectionList from "./ConnectionList";
import GlossaryItem from "./GlossaryItem";

function EmptyPanel({ onStartGuided }) {
  return (
    <div className="panel-empty">
      <p className="panel-eyebrow">Interactive map</p>
      <h2>See how the wheel fits together.</h2>
      <p>
        Choose any slice, ring, realm, or frame symbol. The wheel stays central, while this panel
        explains where that part sits and how it connects to the whole.
      </p>
      <div className="panel-empty-actions">
        <button type="button" className="primary-button" onClick={onStartGuided}>
          Start guided mode
        </button>
        <p>Tip: hover a region to preview it, then click to lock it in.</p>
      </div>
    </div>
  );
}

function DetailPanel({ node, relatedNodes, glossaryItems, onSelect, onClear, onStartGuided }) {
  if (!node) {
    return <EmptyPanel onStartGuided={onStartGuided} />;
  }

  return (
    <div className="detail-panel-content">
      <div className="panel-topline">
        <div>
          <p className="panel-eyebrow">
            {node.ring} ring • {node.type}
          </p>
          <h2>{node.title}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onClear}>
          Full wheel
        </button>
      </div>

      <p className="panel-summary">{node.shortDescription}</p>

      <section className="panel-grid">
        <article>
          <h3>What this is</h3>
          <p>{node.represents}</p>
        </article>
        <article>
          <h3>Where it sits</h3>
          <p>{node.placement}</p>
        </article>
        <article>
          <h3>How it functions</h3>
          <p>{node.insideSystem}</p>
        </article>
        <article>
          <h3>Why it matters</h3>
          <p>{node.whyItMatters}</p>
        </article>
      </section>

      <section className="panel-section">
        <h3>Plain-language explanation</h3>
        <p>{node.longDescription}</p>
      </section>

      <details className="deep-dive" open>
        <summary>Deeper explanation</summary>
        <p>{node.deeperNotes}</p>
      </details>

      <ConnectionList relatedNodes={relatedNodes} onSelect={onSelect} />

      {node.glossaryNote ? (
        <section className="panel-section">
          <h3>Glossary note</h3>
          <p>{node.glossaryNote}</p>
        </section>
      ) : null}

      {glossaryItems.length ? (
        <section className="panel-section">
          <h3>Terms nearby</h3>
          <dl className="glossary-list">
            {glossaryItems.map((item) => (
              <GlossaryItem key={item.id} item={item} />
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}

export default DetailPanel;
