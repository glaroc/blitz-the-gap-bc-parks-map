/* eslint-disable dot-notation */
import React, { useState, useEffect } from "react";
import { MapContainer, ScaleControl, ZoomControl, Popup } from "react-leaflet";
import L from "leaflet";
import Control from "react-leaflet-custom-control";
import {
  Button,
  Autocomplete,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { ColorPicker } from "../ColormapPicker";
import MSMapSlider from "../CustomMap/MSMapSlider";
import type { FeatureCollection } from "geojson";

/**
 *
 * @param props properties
 * @returns component
 */
function MapOverlay(props: any) {
  //const generalState = useSelector((state: any) => state.reducerState);
  //const drawerOpen = useSelector((state: any) => state.reducerState.drawerOpen);
  const {
    selectedLayerURL,
    isTimeSeriesCollection,
    timeSeriesLayers,
    opacity,
    setOpacity,
    colormap,
    setColormap,
    colormapList,
  } = props;
  const [mapWidth, setMapWidth] = useState("100vw");
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [showStatsButton, setShowStatsButton] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [clickedPlace, setClickedPlace] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupProps, setPopupProps] = useState({
    key: 0,
    position: L.latLng(0, 0),
  });
  const emptyFC: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  let numPopups = 0;
  const [geojson, setGeojson] = useState<FeatureCollection>(emptyFC);
  const [rasterStats, setRasterStats] = useState({});
  const [timeSeriesStats, setTimeSeriesStats] = useState({});

  return (
    <>
      <MSMapSlider
        absolute={true}
        location={"bottom-left"}
        bottom={40}
        left={10}
        width={200}
        notifyChange={(newValue: any) => setOpacity(newValue)}
        value={opacity}
      />
      <ColorPicker
        setColormap={setColormap}
        colormap={colormap}
        colormapList={colormapList}
      />
    </>
  );
}

export default MapOverlay;
