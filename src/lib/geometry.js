const DEGREE_OFFSET = -90;

export function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const radians = ((angleInDegrees + DEGREE_OFFSET) * Math.PI) / 180.0;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

export function describeSector(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  if (innerRadius === 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${endOuter.x} ${endOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${startOuter.x} ${startOuter.y}`,
      "Z",
    ].join(" ");
  }

  return [
    `M ${endOuter.x} ${endOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${startOuter.x} ${startOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

export function getSegmentCentroid(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const angle = startAngle + (endAngle - startAngle) / 2;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;

  return polarToCartesian(cx, cy, radius, angle);
}

export function getNodeAnchor(node, cx, cy) {
  const position = node.position;

  if (!position) {
    return { x: cx, y: cy };
  }

  if (position.shape === "segment") {
    return getSegmentCentroid(
      cx,
      cy,
      position.innerRadius,
      position.outerRadius,
      position.startAngle,
      position.endAngle,
    );
  }

  return { x: position.x, y: position.y };
}

export function getTextLines(label) {
  const words = label.split(" ");

  if (words.length <= 2) {
    return [label];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}
