import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from "@mui/material/Grid";
import { Icon, Card, Divider, IconButton } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import Slide from '@mui/material/Slide';
import { styled } from "@mui/material/styles";

// Denbot Admin components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";

// Denbot Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { getSessionsApi, deleteSessionApi, createSessionApi } from 'library/apis/session';
import CustomizedMenus from './components/menu';
import CreateModal from './components/createModal';

const ClickableCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5); /* Add your desired hover effect styles */
  }
`;

const SessionCard = ({ item, fetchData, handleNotification }) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate('/builder', { state: { item: item } });
  }

  const [openModal, setOpenModal] = useState(false);

  const actionEdit = () => {
    setOpenModal(true);
  }

  const actionTest = () => {
    const color = item.color ? item.color : '#FF6900';
    navigate(`/preview/${item._id}?color=${color.substring(1)}`);
  }

  const actionDuplicate = async () => {
    try {
      const data = { nodes: item.nodes, edges: item.edges, color: item.color, avatar: item.avatar, name: item.name }
      await createSessionApi(data);
      fetchData().catch(console.error);
    } catch (error) {
      console.log(error);
    }
  }
  const actionDelete = async () => {
    try {
      await deleteSessionApi(item._id);
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
    const text_sctipt = `<script src="http://13.50.98.6/denbot.js" botId="${item._id}" button-color="${item.color ? item.color : '#FF6900'}"></script>`;
    navigator.clipboard.writeText(text_sctipt);
    handleNotification();
  }

  return (
    <div>
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
              {!item?.avatar && <Icon fontSize="medium" color="inherit">message</Icon>}
              {item?.avatar && <MDBox component="img" src={item?.avatar} sx={{ borderRadius: 3, borderWidth: 2, borderColor: item?.color || '#FF6900' }} />}

            </MDBox>
            <CustomizedMenus handleMenuAction={handleMenuAction} />
          </MDBox>
          <MDBox mt={1}>
            <MDTypography variant="h5" noWrap={true}>{item?.name || 'No title'}</MDTypography>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox mx={1} mb={1}>
          <MDBox display="flex" flexDirection="row" justifyContent="center" alignItems="center">
            <MDTypography
              variant="h5"
              fontWeight="bold"
              color="success"
            >
              {item?.nodes?.length || 0}
            </MDTypography>
            <MDTypography noWrap variant="button" color="text" display="inline-block" sx={{ flex: 1 }}/>
            <Tooltip title="Copy this script code for the deploy.">
              <IconButton onClick={handleCopyID}>
                <Icon fontSize="small" sx={{ color: '#ffffff88' }}>copy</Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        </MDBox>
      </ClickableCard>
      <CreateModal item={item} open={openModal} setOpen={setOpenModal} fetchData={fetchData} />
    </div>
  );
}

function Nodes() {

  const [openCreateModal, setOpenCreateModal] = useState(false);

  function TransitionRight(props) {
    return <Slide {...props} direction="left" />;
  }

  const [alert, setAlert] = useState(false);
  const openAlert = () => setAlert(true);
  const closeAlert = () => setAlert(false);

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

  const handleNotification = () => {
    openAlert();
  }

  return (
    <DashboardLayout >
      <DashboardNavbar isMini />
      <MDButton
        variant="gradient"
        color="dark"
        startIcon={<Icon>add</Icon>}
        onClick={handleAdd}>Create a bot</MDButton>
      <MDBox py={3}>
        <Grid container spacing={3}>
          {item.map((i) => (
            <Grid item xs={6} md={4} lg={2}>
              <SessionCard
                item={i}
                fetchData={fetchData}
                handleNotification={handleNotification}
              />
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <CreateModal open={openCreateModal} setOpen={setOpenCreateModal} />
      <MDSnackbar
        color="success"
        icon="check"
        title="Script copy"
        content="Successfully copied script for the deploy."
        open={alert}
        TransitionComponent={TransitionRight}
        onClose={closeAlert}
        close={closeAlert}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Nodes;
