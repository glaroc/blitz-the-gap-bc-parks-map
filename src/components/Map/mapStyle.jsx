
const config = { MAPTILER_TOKEN: "U4hNLWRENxTa7CfHUUnN" };

export const baseLayers = [
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
  }
];
