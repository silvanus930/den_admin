
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// Denbot Admin components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import { useNavigate } from "react-router-dom";

// Denbot Admin examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const DefaultInfoCard = ({ icon, title, description, isActive }) => {
  
  const activeColor = '#202950';
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/billing/stripe');
  }

  return (
    <Card sx={{ backgroundColor: isActive ? activeColor : '' }}>
      <MDBox p={5} mx={3} display="flex" justifyContent="center">
        <MDBox
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor={isActive ? 'info' : 'secondary'}
          color="white"
          width="4rem"
          height="4rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
        >
          <Icon fontSize="default">{icon}</Icon>
        </MDBox>
      </MDBox>
      <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {description && (
          <MDTypography variant="h6" color="text" fontWeight="large">
            {description}
          </MDTypography>
        )}
        <Divider />
        {!isActive && <MDButton variant="gradient" color="dark" onClick={handleSubscribe}>
          Subscribe
        </MDButton>}
        {isActive && (
          <MDTypography variant="h5" fontWeight="medium">Active</MDTypography>
        )}
      </MDBox>
    </Card >
  )
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function Princing() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox display="flex" justifyContent="center" height="90vh" alignItems="center">
        <MDBox mb={3} display="flex" justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Grid container spacing={8}>
              <Grid item xs={12} md={4} xl={4}>
                <DefaultInfoCard
                  icon="account_balance"
                  isActive
                  title="Free"
                  description="0 $"
                />
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <DefaultInfoCard
                  icon="account_balance"
                  title="Monthly"
                  description="25 $ / month"
                />
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <DefaultInfoCard
                  icon="account_balance"
                  title="Annually"
                  description="200 $ / annual"
                />
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Princing;
