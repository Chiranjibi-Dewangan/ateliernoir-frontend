function SectionIndex({ groups, onSelect }) {
  return (
    <section className="section-index" aria-label="Jump to a section">
      {groups.map((group) => (
        <div key={group.title} className="index-group">
          <p>{group.title}</p>
          <div className="index-chips">
            {group.items.map((item) => (
              <button key={item.id} type="button" className="index-chip" onClick={() => onSelect(item.id)}>
                {item.shortLabel}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default SectionIndex;
