import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from "@mui/material/Grid";
import { Icon, Card, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

// Denbot Admin components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Denbot Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { getSessionApi } from 'library/apis/session';

const ClickableCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5); /* Add your desired hover effect styles */
  }
`;

const SessionCard = ({ item }) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate('/builder', { state: { item: item } });
  }

  return (
    <ClickableCard onClick={handleNav}>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2} flexDirection="column">
        <MDBox
          variant="gradient"
          bgColor="dark"
          color="white"
          coloredShadow="dark"
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
          ml={-1}
        >
          <Icon fontSize="medium" color="inherit">message</Icon>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="h5" noWrap={true}>{item?.title || 'No title'}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox mx={1} mb={1}>
        <MDTypography
          variant="button"
          fontWeight="bold"
          color="success"
        >
          {item?.nodes?.length || 0}
        </MDTypography>
        <MDTypography component="p" variant="button" color="text" display="flex" maxHeight={48} lineHeight={1.5} overflow="hidden">
          {'details'}
        </MDTypography>
      </MDBox>
    </ClickableCard>
  );
}

function Nodes() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessionApi();
        console.log(data.data);
        setItem(data.data);
      } catch (error) {
        console.log('Error');
      }
    }
    fetchData().catch(console.error);
  }, []);

  const [item, setItem] = useState([]);
  const navigate = useNavigate();

  const handleAdd = () => {
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
              <SessionCard item={i} />
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Nodes;
