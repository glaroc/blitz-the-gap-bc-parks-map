import React from "react";
import { SidebarFormContainer } from "./sidebarformstyles";

/**
 *
 * @param props props
 * @returns  component
 */
function SidebarForms(props: any) {
  const { sidebarContent } = props;

  return (
    <SidebarFormContainer onClick={(event: any) => event.stopPropagation()}>
      {sidebarContent}
    </SidebarFormContainer>
  );
}

export default SidebarForms;
