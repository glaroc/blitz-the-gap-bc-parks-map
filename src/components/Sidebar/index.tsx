import React, { useContext } from "react";
import TranslationContext from "src/context/Translation";

import SidebarForms from "./SidebarForms";

import {
  SiderTitleContainer,
  SideContainer,
  Description,
} from "./sidebarstyle";

// import SidebarForms from "./SidebarForms";

function Sidebar(props: any) {
  const { t = (text: string) => text } = props;

  return (
    <SideContainer>
      <SidebarForms translator={t} {...props} />
    </SideContainer>
  );
}

export default Sidebar;
