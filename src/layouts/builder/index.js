// import { useState } from "react";

// @mui material components
// import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Denbot Admin components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// import MDAlert from "components/MDAlert";
// import MDButton from "components/MDButton";
// import MDSnackbar from "components/MDSnackbar";

// Denbot Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Footer from "examples/Footer";

import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import OverviewFlow from "./components/OverviewFlow";

function Builder() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={1} mb={3} height="30rem">
          <OverviewFlow/>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Builder;
