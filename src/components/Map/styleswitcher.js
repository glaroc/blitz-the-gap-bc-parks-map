import { baseLayers } from "./mapStyle";
const config = { MAPTILER_TOKEN: "U4hNLWRENxTa7CfHUUnN" };

export class MapLibreStyleSwitcherControl {
  constructor(styles, defaultStyle) {
    this.styles = styles || MapLibreStyleSwitcherControl.DEFAULT_STYLES;
    this.defaultStyle =
      defaultStyle || MapLibreStyleSwitcherControl.DEFAULT_STYLE;
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }
  getDefaultPosition() {
    const defaultPosition = "top-right";
    return defaultPosition;
  }
  onAdd(map) {
    this.map = map;

    this.controlContainer = document.createElement("div");
    this.controlContainer.classList.add("maplibregl-ctrl");
    this.controlContainer.classList.add("maplibregl-ctrl-group");
    this.mapStyleContainer = document.createElement("div");
    this.styleButton = document.createElement("button");
    this.styleButton.type = "button";
    this.mapStyleContainer.classList.add("maplibregl-style-list");
    for (const style of this.styles) {
      const styleElement = document.createElement("button");
      styleElement.type = "button";
      styleElement.innerText = style.title;
      styleElement.classList.add(style.title.replace(/[^a-z0-9-]/gi, "_"));
      styleElement.dataset.uri = JSON.stringify(style.uri);
      styleElement.addEventListener("click", (event) => {
        const srcElement = event.srcElement;
        if (srcElement.classList.contains("active")) {
          return;
        }
        const currentLayers =
          (this.map && this.map.getStyle && this.map.getStyle().layers) || [];
        currentLayers.forEach((layer) => {
          if (layer && layer.id && layer.id.includes("ol-")) {
            if (this.map.getLayer(layer.id)) {
              this.map.removeLayer(layer.id);
            }
          }
        });
        this.map.triggerRepaint();
        if (style.uri !== "") {
          fetch(JSON.parse(srcElement.dataset.uri))
            .then((res) => res.json())
            .then((sty) => {
              // add any sources from the style first
              if (sty.sources) {
                Object.entries(sty.sources).forEach(([sourceId, sourceDef]) => {
                  try {
                    if (!this.map.getSource(sourceId)) {
                      this.map.addSource(sourceId, sourceDef);
                    }
                  } catch (err) {
                    console.error("Failed to add source", sourceId, err);
                  }
                });
              }

              // add layers (prefix ids to avoid collisions).
              // Insert new layers below our overlay hex layers so they don't cover data overlays.
              if (sty.layers && Array.isArray(sty.layers)) {
                const existingLayers = (this.map.getStyle && this.map.getStyle().layers) || [];
                const existingIds = existingLayers.map((l) => l.id);
                const overlayCandidates = [
                  "hex_5km",
                  "hex_10km",
                  "hex_25km",
                  "hex_50km",
                  "hex_100km",
                  "counties",
                ];
                // find first overlay layer that exists in the current style
                const beforeOverlay = overlayCandidates.find((id) => existingIds.includes(id));
                // if none found, insert before the first existing layer (bottom)
                const bottomLayerId = existingIds.length ? existingIds[0] : null;

                sty.layers.forEach((layer) => {
                  if (!layer || !layer.id) return;
                  const newLayer = Object.assign({}, layer, { id: "ol-" + layer.id });
                  try {
                    if (this.map.getLayer(newLayer.id)) {
                      this.map.removeLayer(newLayer.id);
                    }
                    const insertBefore = beforeOverlay || bottomLayerId;
                    if (insertBefore && this.map.getLayer(insertBefore)) {
                      this.map.addLayer(newLayer, insertBefore);
                    } else {
                      // fallback: add to bottom by inserting before first layer id if available
                      if (bottomLayerId && this.map.getLayer(bottomLayerId)) {
                        this.map.addLayer(newLayer, bottomLayerId);
                      } else {
                        this.map.addLayer(newLayer);
                      }
                    }
                  } catch (err) {
                    console.error("Failed to add layer", newLayer.id, err);
                  }
                });
              }
              this.map.triggerRepaint();
            })
            .catch((err) => console.error("Error loading style", err));
        }
        this.mapStyleContainer.style.display = "none";
        this.styleButton.style.display = "block";
        const elms = this.mapStyleContainer.getElementsByClassName("active");
        while (elms[0]) {
          elms[0].classList.remove("active");
        }
        srcElement.classList.add("active");
      });
      if (style.title === this.defaultStyle) {
        styleElement.classList.add("active");
      }
      this.mapStyleContainer.appendChild(styleElement);
    }
    this.styleButton.classList.add("maplibregl-ctrl-icon");
    this.styleButton.classList.add("maplibregl-style-switcher");
    this.styleButton.addEventListener("click", () => {
      this.styleButton.style.display = "none";
      this.mapStyleContainer.style.display = "block";
    });
    document.addEventListener("click", this.onDocumentClick);
    this.controlContainer.appendChild(this.styleButton);
    this.controlContainer.appendChild(this.mapStyleContainer);
    return this.controlContainer;
  }
  onRemove() {
    if (
      !this.controlContainer ||
      !this.controlContainer.parentNode ||
      !this.map ||
      !this.styleButton
    ) {
      return;
    }
    this.styleButton.removeEventListener("click", this.onDocumentClick);
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    document.removeEventListener("click", this.onDocumentClick);
    this.map = undefined;
  }
  onDocumentClick(event) {
    if (
      this.controlContainer &&
      !this.controlContainer.contains(event.target) &&
      this.mapStyleContainer &&
      this.styleButton
    ) {
      this.mapStyleContainer.style.display = "none";
      this.styleButton.style.display = "block";
    }
  }
}
MapLibreStyleSwitcherControl.DEFAULT_STYLE = "Demotiles";
MapLibreStyleSwitcherControl.DEFAULT_STYLES = baseLayers;
