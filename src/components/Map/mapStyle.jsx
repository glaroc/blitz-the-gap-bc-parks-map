const config = { MAPTILER_TOKEN: "U4hNLWRENxTa7CfHUUnN" };

export const baseLayers = [
  {
    title: "Dark basemap",
    type: "raster",
    tiles: ["https://01.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"],
    tileSize: 256,
  },
  {
    title: "Light basemap",
    uri:
      "https://api.maptiler.com/maps/outdoor-v2/style.json?key=" +
      config.MAPTILER_TOKEN,
  },
  {
    title: "Satellite basemap",
    uri:
      "https://api.maptiler.com/maps/hybrid/style.json?key=" +
      config.MAPTILER_TOKEN,
  },
];
