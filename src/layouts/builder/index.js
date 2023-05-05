import React, { useState } from 'react';
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "assets/css/bot.css";
import "reactflow/dist/style.css";
import OverviewFlow from "./components/OverviewFlow";
import EmbedChatBot from 'examples/EmbedChatBot';

function Builder() {

  const [showIframe, setShowIframe] = useState(false);
  const [initial, setInitial] = useState(true);

  const toggleIframe = () => {
    !initial && setInitial(true);
    setShowIframe(!showIframe);
  };

  return (
    <DashboardLayout>
      <MDBox mt={1} mb={1} height="34rem">
          <OverviewFlow/>
      </MDBox>
      <EmbedChatBot/>
    </DashboardLayout>
  );
}

export default Builder;
