import { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import _, { every, set } from "lodash";
import { amfhot, haline, ocean, custom } from "./colormaps";
import Popup from "./Popup";
import BaseLegend from "./BaseLegend";
import { MapLibreStyleSwitcherControl } from "./styleswitcher";
import { baseLayers } from "./mapStyle";
import "./map.css";

export default function Map(props) {
  const { COGUrl, opacity, challenges, challenge, colorBy } = props;

  const [mapp, setMapp] = useState(null);
  const greenpal = [{value:10, color:"#22301a"}, {value:50, color:"#3f5830"}, {value:100, color:"#54793e"}, {value:500, color:"#98cd79"}, {value:2500, color:"#cce7bd"}]
  const bluepal = [{value:5, color:"#22301a"}, {value:10, color:"#34426e"}, {value:50, color:"#5a6eae"}, {value:200, color:"#5aa6ed"}, {value:500, color:"#b5d1eb"}]
  const mapRef = useRef();
  const [valueColors, setValueColors] = useState(greenpal)
  //const colormap = encodeURIComponent(JSON.stringify(amfhot));
  const colormap = "viridis";


  useEffect(() => {
    let ignore = true;
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
      ignore = false;
    };
  }, []);

  const chalpal = (colorBy) => {
    if (colorBy==='obsdens'){
        setValueColors(greenpal)
      return [
        "interpolate",
        ["linear"],
        ["to-number", ["get", colorBy]],
        greenpal[0].value,
        greenpal[0].color,
        greenpal[1].value,
        greenpal[1].color,
        greenpal[2].value,
        greenpal[2].color,
        greenpal[3].value,
        greenpal[3].color,
        greenpal[4].value,
        greenpal[4].color,
      ];
    }
    else{
      setValueColors(bluepal)
      return [
        "interpolate",
        ["linear"],
        ["to-number", ["get", colorBy]],
        bluepal[0].value,
        bluepal[0].color,
        bluepal[1].value,
        bluepal[1].color,
        bluepal[2].value,
        bluepal[2].color,
        bluepal[3].value,
        bluepal[3].color,
        bluepal[4].value,
        bluepal[4].color,
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
            hex_100km: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/all_100km.pmtiles"
            },
            hex_50km: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/all_50km.pmtiles"
            },
            hex_25km: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/all_25km.pmtiles"
            },
            hex_10km: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/all_10km.pmtiles"
            },
            hex_5km: {
              type: "vector",
              url: "pmtiles://https://object-arbutus.cloud.computecanada.ca/bq-io/blitz-the-gap/all_5km.pmtiles"
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
              id: "hex_5km",
              type: "fill",
              "source-layer": "all_5km",
              source: "hex_5km",
              paint: {
                "fill-color": chalpal(challenge, colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffff22",
              },
              minzoom: 6,
            },
            {
              id: "hex_10km",
              type: "fill",
              "source-layer": "all_10km",
              source: "hex_10km",
              paint: {
                "fill-color": chalpal(colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffff11",
              },
              minzoom: 5,
              maxzoom: 6,
            },
            {
              id: "hex_25km",
              type: "fill",
              "source-layer": "all_25km",
              source: "hex_25km",
              paint: {
                "fill-color": chalpal(colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffff11",
              },
              minzoom: 3,
              maxzoom: 5,
            },
            {
              id: "hex_50km",
              type: "fill",
              "source-layer": "all_50km",
              source: "hex_50km",
              paint: {
                "fill-color": chalpal(colorBy),
                "fill-opacity": 0.4,
                "fill-outline-color": "#ffffff11",
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
      map.once('load', () => {
        baseLayers.forEach((source) => {
          if (source.uri !== "") {
            fetch(source.uri)
              .then((res) => res.json())
              .then((sty) => {
                Object.entries(sty.sources).forEach(([sourceId, sourceDef]) => {
                  if (map && !map.getSource(sourceId)) {
                    map.addSource(sourceId, sourceDef);
                  }
                });
              });
          }
        });
      });
      map.addControl(new maplibregl.GlobeControl());
      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        })
      );
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const container = document.createElement("div");

        ReactDOM.createRoot(container).render(
          <div style={{ textAlign: "center", fontSize: "16px" }}>
          <>
            Number of observations<br/><div style={{fontSize: "20px", fontWeight: "bold", paddingTop: "5px", color: "#3f5830"}}> {features[0].properties.obsdens}</div>
          </>
          <>
            Number of species<br/><div style={{fontSize: "20px", fontWeight: "bold", paddingTop: "5px", color: "#34426e"}}>{features[0].properties.spdens?features[0].properties.spdens:"0"}</div>
          </>
          </div>
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
      mapp.setPaintProperty(
        "hex_5km",
        "fill-color",
        chalpal(colorBy)
      );
      mapp.setPaintProperty(
        "hex_10km",
        "fill-color",
        chalpal(colorBy)
      );
      mapp.setPaintProperty(
        "hex_25km",
        "fill-color",
        chalpal(colorBy)
      );
      mapp.setPaintProperty(
        "hex_50km",
        "fill-color",
        chalpal(colorBy)
      );

      mapp.triggerRepaint();
    }
    return () => {};
  }, [mapp, challenge, colorBy]);

  // determine legend params based on colorBy
  const legendParams = (() => {
    if (colorBy === "obsdens") {
      return {
        min: 10,
        max: 2500,
        colors: ["#22301a", "#3f5830", "#54793e", "#98cd79", "#cce7bd"],
      };
    }
    return {
      min: 5,
      max: 500,
      colors: [
        "#22301a",
        "#34426e",
        "#5a6eae",
        "#5aa6ed",
        "#b5d1eb",
      ],
    };
  })();

  return (
    <div
      id="App"
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: "0",
        background: "url('/blitz-the-gap-bc-parks-map/night-sky.png')",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          zIndex: 2000,
          pointerEvents: "auto",
          backgroundColor: "white",
          padding: "10px",
          width: 75,
          borderRadius: 5,
        }}
      >
        {BaseLegend(valueColors)}
      </div>
    </div>
  );
}
