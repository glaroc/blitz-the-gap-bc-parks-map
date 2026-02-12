import styled from "styled-components";
import { colors, Container } from "../../styles";
import "../../css/external/common.css";

export const SideContainer = styled(Container)`
  color: ${colors.white};
  width: 100%;
  background-color: transparent;
  display: block;
  position: abolute;
  left: 20px;
`;

export const SiderTitleContainer = styled(Container)`
  color: white;
  width: 100%;
  z-index: 5;
  left: 10px;
`;

export const Description = styled.div`
  background-color: #7bb5b1;
  width: 100%;
  color: #fff;
  padding: 12px;
  border-radius: 0;
  margin: 0 0 20px;
  align-items: center;
`;
