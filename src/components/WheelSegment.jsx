import { describeSector } from "../lib/geometry";
import { FrameNodeArtwork, getSegmentFill, SegmentIllustration, SegmentLabel, TagArtwork } from "./WheelArt";

function WheelSegment({
  node,
  cx,
  cy,
  state,
  onSelect,
  onPreview,
  onEndPreview,
}) {
  const position = node.position;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(node.id);
    }
  };

  const sharedProps = {
    tabIndex: 0,
    role: "button",
    "aria-label": `${node.title}. ${node.shortDescription}`,
    "aria-pressed": state.isSelected,
    onClick: (event) => {
      event.stopPropagation();
      onSelect(node.id);
    },
    onKeyDown: handleKeyDown,
    onMouseEnter: (event) => onPreview(node, event),
    onMouseMove: (event) => onPreview(node, event),
    onMouseLeave: onEndPreview,
    onFocus: () => onPreview(node),
    onBlur: onEndPreview,
    className: [
      "wheel-node",
      state.isSelected ? "is-selected" : "",
      state.isRelated ? "is-related" : "",
      state.isDimmed ? "is-dimmed" : "",
    ]
      .filter(Boolean)
      .join(" "),
  };

  if (position.shape === "segment") {
    const path = describeSector(
      cx,
      cy,
      position.innerRadius,
      position.outerRadius,
      position.startAngle,
      position.endAngle,
    );
    const clipId = `clip-${node.id}`;

    return (
      <g {...sharedProps}>
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>
        <path
          d={path}
          fill={getSegmentFill(node)}
          stroke="var(--wheel-stroke)"
          strokeWidth="1.9"
          className="wheel-segment-shell"
        />
        <SegmentIllustration node={node} cx={cx} cy={cy} clipId={clipId} />
        <path d={path} className="wheel-segment-tint" />
        <SegmentLabel node={node} cx={cx} cy={cy} />
      </g>
    );
  }

  if (position.shape === "core-button") {
    return (
      <g {...sharedProps}>
        <circle cx={position.x} cy={position.y} r={position.r + 10} className="core-halo" />
        <circle cx={position.x} cy={position.y} r={position.r} className="core-button" />
        <PigRoosterSnakeSeal x={position.x} y={position.y} />
        <text x={position.x} y={position.y + 62} textAnchor="middle" className="core-button-meta">
          Three poisons
        </text>
      </g>
    );
  }

  if (position.shape === "tag") {
    return (
      <g {...sharedProps}>
        <line
          x1={position.anchorX}
          y1={position.anchorY}
          x2={position.x + 12}
          y2={position.y + position.h / 2}
          className="wheel-callout-line"
        />
        <rect
          x={position.x}
          y={position.y}
          width={position.w}
          height={position.h}
          rx="16"
          className="wheel-tag"
        />
        <TagArtwork node={node} />
      </g>
    );
  }

  if (position.shape === "frame-node") {
    return (
      <g {...sharedProps} transform={`translate(${position.x} ${position.y})`}>
        <FrameNodeArtwork node={node} />
        <text y={position.r + 18} textAnchor="middle" className="frame-node-label">
          {node.shortLabel}
        </text>
      </g>
    );
  }

  return null;
}

function PigRoosterSnakeSeal({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r="26" className="core-seal" />
      <path d="M -8 -2 q -12 -13 -3 -22 q 11 -3 16 8 q -7 1 -13 14" className="hub-animal-outline" />
      <path d="M 4 -13 q 13 -2 16 9 q -9 7 -18 8 q 4 -8 2 -17" className="hub-animal-outline" />
      <path d="M -2 11 q -1 10 9 12 q 11 -5 8 -14 q -6 8 -17 2" className="hub-animal-outline" />
      <circle cx="-13" cy="-10" r="2.1" className="hub-animal-dot" />
      <circle cx="14" cy="-3" r="2.1" className="hub-animal-dot" />
      <circle cx="6" cy="17" r="2.1" className="hub-animal-dot" />
    </g>
  );
}

export default WheelSegment;
