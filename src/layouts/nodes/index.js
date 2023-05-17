import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from "@mui/material/Grid";
import { Icon, Card, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

// Denbot Admin components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Denbot Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { getSessionsApi, deleteSessionApi, createSessionApi } from 'library/apis/session';
import CustomizedMenus from './menu';

const ClickableCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5); /* Add your desired hover effect styles */
  }
`;

const SessionCard = ({ item, fetchData }) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate('/builder', { state: { item: item } });
  }

  const actionEdit = () => {

  }

  const actionTest = () => {
    navigate(`/preview/${item._id}`);
  }

  const actionDuplicate = async () => {
    try {
      const data = { nodes: item.nodes, edges: item.edges }
      const result = await createSessionApi(data);
      fetchData().catch(console.error);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  const actionDelete = async () => {
    try {
      const result = await deleteSessionApi(item._id);
      fetchData().catch(console.error);
    } catch (error) {
      console.log(error);
    }
  }

  const handleMenuAction = (id) => {
    if (id == 'edit') actionEdit()
    else if (id === 'test') actionTest()
    else if (id === 'filecopy') actionDuplicate()
    else if (id === 'delete') actionDelete()
  }

  const handleCopyID = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(item._id);
  }

  return (
    <ClickableCard onClick={handleNav}>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2} flexDirection="column">
        <MDBox display="flex" justifyContent="space-between">
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
          <CustomizedMenus handleMenuAction={handleMenuAction} />
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="h5" noWrap={true}>{item?.title || 'No title'}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox mx={1} mb={1}>
        <MDTypography
          variant="h5"
          fontWeight="bold"
          color="success"
        >
          {item?.nodes?.length || 0}
        </MDTypography>
        <MDBox display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <MDTypography noWrap variant="button" color="text" display="inline-block">
            {`ID: ${item._id}`}
          </MDTypography>
          <IconButton onClick={handleCopyID}>
            <Icon fontSize="small" sx={{ color: '#ffffff88' }}>copy</Icon>
          </IconButton>
        </MDBox>
      </MDBox>
    </ClickableCard>
  );
}

function Nodes() {

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getSessionsApi();
      console.log(data.data);
      setItem(data.data);
    } catch (error) {
      console.log('Error');
    }
  }

  const [item, setItem] = useState([]);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate('/builder');
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDButton
        variant="gradient"
        color="dark"
        startIcon={<Icon>add</Icon>}
        onClick={handleAdd}>Create a bot</MDButton>
      <MDBox py={3}>
        <Grid container spacing={3}>
          {item.map((i) => (
            <Grid item xs={6} md={4} lg={2}>
              <SessionCard item={i} fetchData={fetchData} />
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Nodes;
