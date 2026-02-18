import React, { useRef } from "react";
import ReactDOMServer from "react-dom/server";
import "./style.css";

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
        <LegendItem key={i} color={item.color} text={item.value} />
      ))}
    </div>
  );
}

export default function BaseLegend(valueColors) {
  return (
    <div className="legend-group">
      <Legend items={valueColors} />
    </div>
  );
}
