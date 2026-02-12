import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  MapScaleContainer,
  MapScaleItems,
  MapTypeContainer,
} from "./mapscalestyle";

const MapType = (props: any) => {
  const { url } = props;
  return (
    <MapTypeContainer>
      <MapContainer
        style={{ width: "60px", height: "100%" }}
        zoomControl={false}
        zoom={3}
        center={[55, -72]}
      >
        <TileLayer url={url} />
      </MapContainer>
    </MapTypeContainer>
  );
};

export const MapLayerSelector = (props: any) => {
  const { onSelect } = props;
  return (
    <MapScaleContainer>
      <MapScaleItems>
        <MapType url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
        <MapType url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png" />
        <MapType url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
      </MapScaleItems>
    </MapScaleContainer>
  );
};
