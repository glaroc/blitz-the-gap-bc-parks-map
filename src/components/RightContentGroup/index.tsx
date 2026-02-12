import React from "react";
import { RightContent } from "../../styles";
import CustomMap from "../CustomMap";
import Map from "../Map";
import MapOverlay from "../MapOverlay";
import { Route, Routes } from "react-router-dom";

/**
 *
 * @param props properties
 * @returns component
 */
const RightContentGroup = (props: any) => {
  return (
    <RightContent style={{ width: "100vw" }}>
      <Map {...props} />
      <MapOverlay {...props} />
    </RightContent>
  );
};

export default RightContentGroup;
