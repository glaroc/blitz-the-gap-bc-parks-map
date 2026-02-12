import { useState, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";

const getRoundNum = (number: number): number => {
  const pow10 = 10 ** (`${Math.floor(number)}`.length - 1);
  let d = number / pow10;

  // eslint-disable-next-line no-nested-ternary
  d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

  return pow10 * d;
};

const getMetricScale = (map: any): any => {
  try {
    const dist = map.distance(
      map.containerPointToLatLng([0, map.getSize().y / 2]),
      map.containerPointToLatLng([100, map.getSize().y / 2])
    );

    const meters = getRoundNum(dist);
    const label = meters < 1000 ? `${meters} m` : `${meters / 1000} km`;
    return label;
  } catch (error) {
    return error;
  }
};

const getImperialScale = (map: any): any => {
  try {
    const maxMeters = map.distance(
      map.containerPointToLatLng([0, map.getSize().y / 2]),
      map.containerPointToLatLng([100, map.getSize().y / 2])
    );
    const maxFeet = maxMeters * 3.2808399;

    if (maxFeet > 5280) {
      const maxMiles = maxFeet / 5280;
      const miles = getRoundNum(maxMiles);
      return `${miles}mi`;
    }
    const feet = getRoundNum(maxFeet);
    return `${feet}mi`;
  } catch (error) {
    return error;
  }
};

export const useScale = (map: any) => {
  const [scale, setScale] = useState({ metric: "none", imperial: "none" });

  const mapEvents = useMapEvents({
    resize: (e) => {
      const metric = getMetricScale(map);
      const imperial = getImperialScale(map);

      setScale((old) => ({ ...old, metric, imperial }));
    },
    load: () => {
      const metric = getMetricScale(map);
      const imperial = getImperialScale(map);

      setScale((old) => ({ ...old, metric, imperial }));
    },
  });

  useEffect(() => {
    const metric = getMetricScale(map);
    const imperial = getImperialScale(map);
    setScale((old) => ({ ...old, metric, imperial }));
  }, [map]);

  return scale;
};
