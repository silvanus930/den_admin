/**
=========================================================
* Denbot Admin - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Denbot Admin components
import MDBox from "components/MDBox";

// Denbot Admin example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Denbot Admin themes
import theme from "assets/theme";

// Denbot Admin Dark Mode themes
import themeDark from "assets/theme-dark";

// Denbot Admin routes
import routes from "routes";

// Denbot Admin contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

import { checkUserAuth } from 'utils/api';

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.key === 'sign-up' || route.key === 'Preview') {
          console.log('Public Router', route.key);
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        else if (route.key === 'sign-in') {
          console.log('LogIn Router', route.key);
          return <Route exact path={route.route} element={ !checkUserAuth() ? route.component : <Navigate to="/nodes" />} key={route.key} />;
        }
        else {
          console.log('Private Router', route.key);
          return <Route exact path={route.route} element={ checkUserAuth() ? route.component : <Navigate to="/authentication/sign-in" />} key={route.key} />;
        }
      }
      return null;
    });

  const isPreview = pathname === '/preview';

  const routesForNav = (routes) => {
    const includeKeys = ['Nodes', 'builder', 'Preview', 'billing', 'profile', 'sign-in'];
    let updateRoutes = routes.filter(route => includeKeys.includes(route.key));
    updateRoutes = updateRoutes.map((route) => {
      if (route.key === 'sign-in') {
        return {
          ...route,
          name: 'Log Out',
          icon: <Icon fontSize="small">logout</Icon>,
        };
      }
      return route;
    });

    return updateRoutes;
    // return routes.filter(route => route.key !== 'sign-in' || route.key !== 'sign-up');
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      {!isPreview && <>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Denbot"
              routes={routesForNav(routes)}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        {layout === "vr" && <Configurator />}
      </>}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
