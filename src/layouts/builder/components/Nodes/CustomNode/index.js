import { memo } from "react";
import { Handle, Position } from "reactflow";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const onConnect = (params) => console.log("handle onConnect", params);

function CustomNode({ title, icon, placeHodler }) {

  return (
    <>
      <Card>
        <MDBox display="flex" py={1.2}>
          <MDBox
            variant="gradient"
            bgColor={'primary'}
            color={"white"}
            coloredShadow={'primary'}
            borderRadius="xl"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3rem"
            height="3rem"
            mt={-2}
            ml={-2}
          >
            <Icon fontSize="medium" color="inherit">{icon}</Icon>
          </MDBox>
          <MDBox textAlign="right">
            <MDTypography ml={1} color="text">{title}</MDTypography>
          </MDBox>
        </MDBox>
        <Divider mt={-1} />
        <MDBox pb={2} px={2}>
          <MDTypography
            component="p"
            variant="button"
            fontWeight="bold"
            color="success"
          >
            {placeHodler}
          </MDTypography>
        </MDBox>
      </Card>
      <Handle
        type="target"
        className="w-2 h-2 bg-cyan-500"
        position={Position.Top}
        onConnect={onConnect}
      />
      <Handle
        type="source"
        className="left-2/4 w-2 h-2 bg-blue-900"
        position={Position.Bottom}
        id="a"
      />
    </>
  );
}

export const NameInputNode = () =>
  <CustomNode
    title="Input Name"
    placeHodler="Please Input your name."
    icon="message"
  />

export const EmailInputNode = () =>
  <CustomNode
    title="Input Email"
    placeHodler="Please Input your email address."
    icon="email"
  />

export const PhoneInputNode = () =>
  <CustomNode
    title="Input Phone"
    placeHodler="Please Input your phone number."
    icon="phone"
  />


export default memo(CustomNode);
