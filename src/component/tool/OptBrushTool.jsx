import React from 'react';

import { useChartData } from '../context/ChartContext';

export default function BrushTool({ position }) {
  const { width, height, margin } = useChartData();
  if (
    !position ||
    position.y < margin.top ||
    position.left < margin.left ||
    position.x > width - margin.right ||
    position.y > height - margin.bottom
  ) {
    return null;
  }
  return (
    <div
      className="moving-element"
      key="crossLine"
      style={{
        cursor: 'crosshair',
        transform: `translate(${-width + position.x}px, ${-height +
          position.y}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        width: 2 * width,
        height: 2 * height,
      }}
    >
      <svg width={2 * width} height={2 * height}>
        <line
          className="vertical_line"
          x1={width}
          y1="0"
          x2={width}
          y2={height * 2}
          key="vertical_line"
        />
        <line
          className="vertical_line"
          x1="0"
          y1={height}
          x2={width * 2}
          y2={height}
          key="horizontal_line"
        />
      </svg>
    </div>
  );
}