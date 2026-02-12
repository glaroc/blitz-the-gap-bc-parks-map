import { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import _, { every } from "lodash";
import { amfhot, haline, ocean, custom } from "./colormaps";
import Popup from "./Popup";
import counties_challenges from "./counties_challenges.json";
import counties_species from "./counties_species.json";
import { MapLibreStyleSwitcherControl } from "./styleswitcher";
import { baseLayers } from "./mapStyle";
import "./map.css";

export default function Map(props) {
  const { COGUrl, opacity, challenges, challenge, colorBy } = props;

  const [mapp, setMapp] = useState(null);

  const mapRef = useRef();

  //const colormap = encodeURIComponent(JSON.stringify(amfhot));
  const colormap = "viridis";

  const everywhere_challenges = challenges
    .filter((c) => c.everywhere === true)
    .map((c) => c.name);

  useEffect(() => {
    let ignore = true;
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
      ignore = false;
    };
  }, []);

  const color_challenges = (value) => {
    if (value < 1) return "#fff0";
    if (value < 100) return "#6ee4f9";
    if (value < 400) return "#34aac0";
    if (value < 600) return "#1a879c";
    return "#177182";
  };

  const chalpal = (chal, colorBy) => {
    if (true) {
      return [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "n_obs"]],
        10,
        "#22301a",
        50,
        "#3f5830",
        100,
        "#54793e",
        500,
        "#638b4c",
        1000,
        "#98cd79",
      ];
    }
  };

  const pal = [
    "interpolate",
    ["case"],
    ["get", "number_of_challenges"],
    2,
    "#ffffff",
    4,
    "#ffff00",
    8,
    "#ff0000",
  ];

  useEffect(() => {
    if (COGUrl && !mapp) {
      const map = new maplibregl.Map({
        container: "App",
        zoom: 3.5,
        center: [-120, 58],
        style: {
          version: 8,
          projection: {
            type: "globe",
          },
          sources: {
            terrain: {
              type: "raster-dem",
              tiles: [
                "https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}?url=https://object-arbutus.cloud.computecanada.ca/bq-io/io/earthenv/topography/elevation_1KMmn_GMTEDmn.tif&rescale=0,2013&bidx=1&expression=b1",
              ],
              tileSize: 256,
            },
            counties: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/alltaxa-hex.pmtiles",
            },
            background: {
              type: "raster",
              tiles: [
                "https://01.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              ],
              tileSize: 256,
            },
          },
          /*terrain: { source: "terrain", exaggeration: 0.025 },*/
          layers: [
            {
              id: "back",
              type: "raster",
              source: "background",
            },
            {
              id: "alltaxa-obsdens-5km",
              type: "fill",
              "source-layer": "alltaxa-obsdens-5km",
              source: "counties",
              paint: {
                "fill-color": chalpal(challenge, colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffffaa",
              },
              minzoom: 8,
            },
            {
              id: "alltaxa-obsdens-10km",
              type: "fill",
              "source-layer": "alltaxa-obsdens-10km",
              source: "counties",
              paint: {
                "fill-color": chalpal(challenge, colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffffaa",
              },
              minzoom: 6,
              maxzoom: 8,
            },
            {
              id: "alltaxa-obsdens-25km",
              type: "fill",
              "source-layer": "alltaxa-obsdens-25km",
              source: "counties",
              paint: {
                "fill-color": chalpal(challenge, colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffffaa",
              },
              minzoom: 3,
              maxzoom: 6,
            },
            {
              id: "alltaxa-obsdens-100km",
              type: "fill",
              "source-layer": "alltaxa-obsdens-100km",
              source: "counties",
              paint: {
                "fill-color": chalpal(challenge, colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffffaa",
              },
              maxzoom: 3,
              minzoom: 0,
            },
          ],
          sky: {
            "atmosphere-blend": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              5,
              1,
              7,
              0,
            ],
          },
          light: {
            anchor: "viewport",
            position: [1.5, 90, 40],
            intensity: 0.25,
            color: "#555",
          },
        },
      });
      baseLayers.forEach((source) => {
        if (source.uri !== "") {
          fetch(source.uri)
            .then((res) => res.json())
            .then((sty) => {
              Object.entries(sty.sources).forEach(([sourceId, sourceDef]) => {
                if (!map.getSource(sourceId)) {
                  map.addSource(sourceId, sourceDef);
                }
              });
            });
        }
      });
      map.addControl(new maplibregl.GlobeControl());
      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        })
      );
      map.on("click", "counties", (e) => {
        const container = document.createElement("div");

        ReactDOM.createRoot(container).render(
          <Popup
            feature={e.features[0].properties}
            everywhere_challenges={everywhere_challenges}
          />
        );

        new maplibregl.Popup()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setDOMContent(container)
          .addTo(map);
      });

      map.on("mouseenter", "counties", () => {
        map.getCanvas().style.cursor = "crosshair";
      });
      map.on("mouseleave", "counties", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.addControl(new MapLibreStyleSwitcherControl());
      setMapp(map);
      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (mapp) {
      /*mapp.setPaintProperty(
        "counties",
        "fill-color",
        chalpal(challenge, colorBy)
      );
      mapp.triggerRepaint();*/
    }
    return () => {};
  }, [mapp, challenge, colorBy]);

  return (
    <div
      id="App"
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: "0",
        background: "url('/blitz-the-gap-map/night-sky.png')",
      }}
    ></div>
  );
}
