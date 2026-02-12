import React from "react";
import { LeftContent } from "../../styles";
import Sidebar from "../Sidebar";

/**
 *
 */
function LeftContentGroup(props: any) {
  return (
    <LeftContent>
      <Sidebar {...props} />
    </LeftContent>
  );
}

export default LeftContentGroup;
