import { useMemo, useRef, useState } from "react";
import wheelOfLifeImage from "../assets/wheel_of_life_print.webp";
import { describeSector, getSegmentCentroid } from "../lib/geometry";
import NodeTooltip from "./NodeTooltip";

const VIEWBOX_WIDTH = 2500;
const VIEWBOX_HEIGHT = 3125;

function normalizeSectorAngles(startAngle, endAngle) {
  if (endAngle <= startAngle) {
    return [startAngle, endAngle + 360];
  }

  return [startAngle, endAngle];
}

function getHotspotShape(node) {
  const hotspot = node.hotspot;

  if (!hotspot) {
    return null;
  }

  if (hotspot.shape === "sector") {
    const [startAngle, endAngle] = normalizeSectorAngles(hotspot.startAngle, hotspot.endAngle);

    return {
      kind: "path",
      d: describeSector(
        hotspot.cx,
        hotspot.cy,
        hotspot.innerRadius,
        hotspot.outerRadius,
        startAngle,
        endAngle,
      ),
    };
  }

  if (hotspot.shape === "ring") {
    return {
      kind: "path",
      d: describeSector(
        hotspot.cx,
        hotspot.cy,
        hotspot.innerRadius,
        hotspot.outerRadius,
        0,
        359.9,
      ),
    };
  }

  if (hotspot.shape === "circle") {
    return {
      kind: "circle",
      cx: hotspot.cx,
      cy: hotspot.cy,
      r: hotspot.r,
    };
  }

  if (hotspot.shape === "ellipse") {
    return {
      kind: "ellipse",
      cx: hotspot.cx,
      cy: hotspot.cy,
      rx: hotspot.rx,
      ry: hotspot.ry,
    };
  }

  if (hotspot.shape === "rect") {
    return {
      kind: "rect",
      x: hotspot.x,
      y: hotspot.y,
      width: hotspot.width,
      height: hotspot.height,
      rx: hotspot.rx ?? 28,
      ry: hotspot.ry ?? 28,
    };
  }

  return null;
}

function getHotspotAnchor(node) {
  const hotspot = node.hotspot;

  if (!hotspot) {
    if (node.id === "frame") {
      return { x: 1250, y: 500 };
    }

    return { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };
  }

  if (hotspot.shape === "sector") {
    const [startAngle, endAngle] = normalizeSectorAngles(hotspot.startAngle, hotspot.endAngle);
    return getSegmentCentroid(
      hotspot.cx,
      hotspot.cy,
      hotspot.innerRadius,
      hotspot.outerRadius,
      startAngle,
      endAngle,
    );
  }

  if (hotspot.shape === "ring") {
    return { x: hotspot.cx, y: hotspot.cy - (hotspot.innerRadius + hotspot.outerRadius) / 2 };
  }

  if (hotspot.shape === "circle" || hotspot.shape === "ellipse") {
    return { x: hotspot.cx, y: hotspot.cy };
  }

  if (hotspot.shape === "rect") {
    return { x: hotspot.x + hotspot.width / 2, y: hotspot.y + hotspot.height / 2 };
  }

  return { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };
}

function getCalloutPoint(node) {
  if (!node.callout) {
    return null;
  }

  return {
    x: (Number.parseFloat(node.callout.x) / 100) * VIEWBOX_WIDTH,
    y: (Number.parseFloat(node.callout.y) / 100) * VIEWBOX_HEIGHT,
  };
}

function renderSvgShape(shape, props) {
  if (!shape) {
    return null;
  }

  if (shape.kind === "path") {
    return <path d={shape.d} {...props} />;
  }

  if (shape.kind === "circle") {
    return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...props} />;
  }

  if (shape.kind === "ellipse") {
    return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...props} />;
  }

  if (shape.kind === "rect") {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rx={shape.rx}
        ry={shape.ry}
        {...props}
      />
    );
  }

  return null;
}

function Wheel({ nodes, nodeMap, selectedId, onSelect, onClear }) {
  const stageRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const selectedNode = selectedId ? nodeMap[selectedId] : null;

  const hotspotMap = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, getHotspotShape(node)])),
    [nodes],
  );

  const selectedIds = useMemo(() => {
    if (!selectedNode) {
      return new Set();
    }

    const ids = new Set([selectedNode.id]);

    if (selectedNode.type === "overview" && selectedNode.ring !== "frame") {
      nodes
        .filter((node) => node.ring === selectedNode.ring && node.id !== selectedNode.id && node.hotspot)
        .forEach((node) => ids.add(node.id));
    }

    if (selectedNode.id === "frame") {
      selectedNode.relatedIds.forEach((id) => ids.add(id));
    }

    if (selectedNode.id === "hell-realm") {
      ids.add("eight-hot-hells");
      ids.add("eight-cold-hells");
    }

    return ids;
  }, [nodes, selectedNode]);

  const relatedIds = useMemo(() => new Set(selectedNode?.visualRelatedIds ?? []), [selectedNode]);
  const selectedMaskIds = [...selectedIds].filter((id) => hotspotMap[id]);

  const handlePreview = (node, event) => {
    const bounds = stageRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    if (event?.clientX && event?.clientY) {
      setTooltip({
        title: node.title,
        text: node.tooltipText,
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      return;
    }

    const anchor = getHotspotAnchor(node);
    setTooltip({
      title: node.title,
      text: node.tooltipText,
      x: (anchor.x / VIEWBOX_WIDTH) * bounds.width,
      y: (anchor.y / VIEWBOX_HEIGHT) * bounds.height,
    });
  };

  const handleEndPreview = () => {
    setTooltip(null);
  };

  const interactiveNodes = [...nodes.filter((node) => node.hotspot)].sort((left, right) => {
    const leftPriority = left.id === "yama" ? -20 : left.type === "overview" ? -10 : 0;
    const rightPriority = right.id === "yama" ? -20 : right.type === "overview" ? -10 : 0;

    return leftPriority - rightPriority;
  });
  const calloutNodes = nodes.filter((node) => node.callout);

  return (
    <div className="wheel-shell">
      <div className="wheel-instruction">
        <span className="instruction-dot" />
        The painting is the interface. Hover to preview, click to focus, or use the keyboard to move
        through the wheel.
      </div>

      <div className="wheel-stage wheel-stage-image" ref={stageRef}>
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="wheel-svg wheel-svg-image"
          aria-label="Interactive image map of the Bhavachakra"
          onClick={() => {
            handleEndPreview();
            onClear();
          }}
        >
          <defs>
            <filter id="paintingGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="22" stdDeviation="28" floodColor="rgba(40, 24, 10, 0.18)" />
            </filter>
            <mask id="selection-dim-mask">
              <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="white" />
              {selectedMaskIds.map((id) =>
                renderSvgShape(hotspotMap[id], {
                  key: `mask-${id}`,
                  fill: "black",
                  stroke: "black",
                  strokeWidth: 0,
                }),
              )}
            </mask>
          </defs>

          <image
            href={wheelOfLifeImage}
            x="0"
            y="0"
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
            className="wheel-painting"
          />

          {selectedNode ? (
            <rect
              x="0"
              y="0"
              width={VIEWBOX_WIDTH}
              height={VIEWBOX_HEIGHT}
              className="painting-dim-overlay"
              mask="url(#selection-dim-mask)"
            />
          ) : null}

          {selectedMaskIds.map((id) =>
            renderSvgShape(hotspotMap[id], {
              key: `selected-fill-${id}`,
              className: "hotspot-selected-fill",
            }),
          )}

          {interactiveNodes.map((node) => {
            const shape = hotspotMap[node.id];
            const isSelected = selectedIds.has(node.id);
            const isRelated = relatedIds.has(node.id);
            const isDimmed = Boolean(selectedNode) && !isSelected && !isRelated;

            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-label={`${node.title}. ${node.shortDescription}`}
                aria-pressed={selectedId === node.id}
                className={[
                  "image-hotspot",
                  isSelected ? "is-selected" : "",
                  isRelated ? "is-related" : "",
                  isDimmed ? "is-dimmed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(node.id);
                }}
                onMouseEnter={(event) => handlePreview(node, event)}
                onMouseMove={(event) => handlePreview(node, event)}
                onMouseLeave={handleEndPreview}
                onFocus={() => handlePreview(node)}
                onBlur={handleEndPreview}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(node.id);
                  }
                }}
              >
                {renderSvgShape(shape, {
                  className: "hotspot-hit-area",
                })}
                {renderSvgShape(shape, {
                  className: "hotspot-outline",
                })}
              </g>
            );
          })}

          {calloutNodes.map((node) => {
            const point = getCalloutPoint(node);
            const anchor = getHotspotAnchor(nodeMap[node.id] ?? node);
            const isSelected = selectedId === node.id;

            if (!point) {
              return null;
            }

            return (
              <g
                key={`callout-${node.id}`}
                className={["wheel-callout-chip", isSelected ? "is-selected" : ""].filter(Boolean).join(" ")}
                tabIndex={0}
                role="button"
                aria-label={`${node.title}. ${node.shortDescription}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(node.id);
                }}
                onMouseEnter={(event) => handlePreview(node, event)}
                onMouseMove={(event) => handlePreview(node, event)}
                onMouseLeave={handleEndPreview}
                onFocus={() => handlePreview(node)}
                onBlur={handleEndPreview}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(node.id);
                  }
                }}
              >
                <path d={`M ${point.x} ${point.y} Q ${point.x} ${point.y + 26} ${anchor.x} ${anchor.y}`} className="callout-connector" />
                <rect x={point.x - 106} y={point.y - 22} width="212" height="44" rx="22" className="callout-pill" />
                <text x={point.x} y={point.y + 5} textAnchor="middle" className="callout-pill-text">
                  {node.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>

        <NodeTooltip tooltip={tooltip} />
      </div>
    </div>
  );
}

export default Wheel;
