function NodeTooltip({ tooltip }) {
  if (!tooltip) {
    return null;
  }

  return (
    <div
      className="node-tooltip"
      style={{
        left: tooltip.x,
        top: tooltip.y,
      }}
      role="status"
    >
      <strong>{tooltip.title}</strong>
      <span>{tooltip.text}</span>
    </div>
  );
}

export default NodeTooltip;
