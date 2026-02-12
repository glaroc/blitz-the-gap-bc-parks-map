import React, { useRef } from "react";
import ReactDOMServer from "react-dom/server";

function LegendItem(props) {
  const { color = "red", text = "" } = props;
  return (
    <div className="legendItem">
      <div className="legendItemColorBox" style={{ background: color }} />
      <div className="legendItemText">
        <span>{text}</span>
      </div>
    </div>
  );
}

export function Legend(items) {
  return (
    <div className="legend">
      {items.items.map((item, i) => (
        <LegendItem key={i} color={item.color} text={item.text} />
      ))}
    </div>
  );
}

/**
 * Factory method
 * @param {Number} min bottom of range
 * @param {Number} max top of range
 * @param {Color[]} scaleColors array of colors
 * @returns a leaflet control object
 */
export default function RangeLegend(min, max, scaleColors) {
  const step = (max - min) / (scaleColors.length - 1);
  const roundFactor = max <= 10 ? 100 : 1;

  const items = scaleColors.map((color, i) => {
    return {
      color: color,
      text: Math.round(roundFactor * (min + i * step)) / roundFactor,
    };
  });
  return (
    <div className="legend-group">
      <Legend items={items} />
    </div>
  );
}
