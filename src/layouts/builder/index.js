import { useLocation, useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "reactflow/dist/style.css";
import OverviewFlow from "./components/OverviewFlow";
import EmbedChatBot from 'examples/EmbedChatBot';

function Builder() {

  const data = useLocation();
  const {id, name} = useParams();

  return (
    <DashboardLayout>
      <MDBox mt={0} mb={0} height="95vh">
        <OverviewFlow item={data?.state?.item}/>
      </MDBox>
    </DashboardLayout>
  );
}

export default Builder;
