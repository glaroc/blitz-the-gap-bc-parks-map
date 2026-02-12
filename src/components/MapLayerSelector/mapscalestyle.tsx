import styled from "styled-components";

export const MapScaleContainer = styled.div`
  position: absolute;
  display: flex;
  padding: 15px;
  background-color: rgba(128, 128, 128, 0.6);
  z-index: 100000;
  border-radius: 5px;
  height: 60px;
  bottom: 50px;
  right: 300px;
  box-sizing: content-box;
`;

export const MapScaleItems = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 5px;
`;

export const MapTypeContainer = styled.div`
  height: 100%;
  position: "relative";
  & .leaflet-control-attribution {
    display: none;
  }
`;
