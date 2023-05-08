import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "assets/css/bot.css";
import "reactflow/dist/style.css";
import OverviewFlow from "./components/OverviewFlow";
import EmbedChatBot from 'examples/EmbedChatBot';

function Builder() {

  return (
    <DashboardLayout>
      <MDBox mt={1} mb={1} height="95vh">
          <OverviewFlow/>
      </MDBox>
      <EmbedChatBot/>
    </DashboardLayout>
  );
}

export default Builder;
