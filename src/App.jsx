import "./App.css";
//import * as THREE from "three";
import React, { useState, useContext } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import ReactTooltip from "react-tooltip";
import Map from "./components/Map";
import Menus from "./components/Menus";
const { useEffect, useRef } = React;

function App() {
  const [COGUrl, setCOGUrl] = React.useState(
    "https://object-arbutus.cloud.computecanada.ca/bq-io/io/inat_canada_heatmaps/All_density_inat_100m.tif"
  );
  const [challenge, setChallenge] = useState("All challenges");
  const [colorBy, setColorBy] = useState("obsdens");
  const challenges = [
    { name: "All challenges", everywhere: false },
    { name: "Conservation priorities (MayBAs)", everywhere: false },
    { name: "Make a splash", everywhere: false },
    { name: "Trailblazers", everywhere: false },
    { name: "99 Percent", everywhere: false },
    { name: "Revisit the past", everywhere: false },
    { name: "Climate gaps", everywhere: false },
    { name: "Birders, don't look up!", everywhere: true },
    { name: "Getting Even", everywhere: true },
    { name: "More than a Monarch", everywhere: true },
    { name: "Missing Canadian Species", everywhere: true },
  ];

  return (
    <>
      <Menus
        {...{ challenges, challenge, setChallenge, colorBy, setColorBy }}
      />
      <Map
        COGUrl={COGUrl}
        opacity={100}
        challenges={challenges}
        challenge={challenge}
        colorBy={colorBy}
      />
      <ReactTooltip
        effect="solid"
        type="dark"
        scrollHide="true"
        event="mousemove"
        eventOff="mouseleave"
        delayHide={1000}
      />
    </>
  );
}
export default App;
