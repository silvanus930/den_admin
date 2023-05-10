import { useState } from 'react';

import Grid from "@mui/material/Grid";
import { useNavigate } from 'react-router-dom';

import { Icon, Card, Divider } from "@mui/material";

// Denbot Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Denbot Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";

const SessionCard = ({ title = "No Title", count = 10 }) => {

  const color = "dark";
  const icon = "message";

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2} flexDirection="column">
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
          ml={-1}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="h5" noWrap={true}>{title}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox mx={1} mb={1}>
        <MDTypography
          variant="button"
          fontWeight="bold"
          color="success"
        >
          {count}
        </MDTypography>
        <MDTypography component="p" variant="button" color="text" display="flex" maxHeight={48} lineHeight={1.5} overflow="hidden">
          {'details'}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

function Nodes() {

  const [item, setItem] = useState([{ title: "Session", count: '10' }, { title: "Session2", count: '10' }, { title: "Session3", count: '30' }])
  const navigate = useNavigate();

  const handleAdd = () => {
    const newItem = { title: `Session-${item.length}`, count: item.length };
    setItem([...item, newItem]);
    navigate('/builder');
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDButton
        variant="outlined"
        startIcon={<Icon>add</Icon>}
        onClick={handleAdd}>Create a bot</MDButton>
      <MDBox py={3}>
        <Grid container spacing={3}>
          {item.map((i) => (
            <Grid item xs={6} md={4} lg={2}>
              <SessionCard title={i.title} count={i.count} />
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Nodes;
