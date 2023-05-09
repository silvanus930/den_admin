import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Box, Button, IconButton, Icon, TextField, Input, Card, Divider, colorManipulator } from '@mui/material';
import React, { memo, useCallback, useState } from "react";

import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { Handle, Position, useOnViewportChange } from "reactflow";

const onConnect = (params) => console.log("handle onConnect", params);

const TextInput = ({ handleId }) => {
  const [value, setValue] = useState('');
  return (
    <Input
      placeholder={'Input text'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      startAdornment={
        <Icon sx={{ ml: 1, mr: 1 }} fontSize="small" color="action">message</Icon>
      }
      endAdornment={
        <Handle
          type="source"
          className="w-3 h-3 bg-blue-900"
          position={Position.Right}
          id={handleId}
        />
      }
      style={{
        background: 'white', borderRadius: 8, borderColor: 'red', borderWidth: '0', margin: 5, padding: 5, width: '300px'
      }}
      autoFocus
      disableUnderline
      multiline
      maxRows={10}
    />
  );
}

function MultiSelectorNode() {

  const onStart = useCallback((viewport) => console.log("onStart", viewport), []);
  const onChange = useCallback((viewport) => console.log("onChange", viewport), []);
  const onEnd = useCallback((viewport) => console.log("onEnd", viewport), []);

  const [inputs, setInputs] = useState([<TextInput key={0} handleId={`handle-0`} />, <TextInput key={1} handleId={`handle-1`} />]);

  const handleAddHandle = () => {
    const newInput = <TextInput key={inputs.length} handleId={`handle-${inputs.length}`} />;
    const newInputs = [...inputs, newInput];
    console.log('newInputs: ', newInputs);
    setInputs(newInputs);
  };

  const handleDeleteHandle = () => {
    if (inputs.length > 1) {
      const newInputs = [...inputs];
      newInputs.pop();
      setInputs(newInputs);
    }
  };

  useOnViewportChange({
    onStart,
    onChange,
    onEnd,
  });

  return (
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
          <Icon fontSize="medium" color="inherit">{'toc'}</Icon>
        </MDBox>
        <MDBox
          variant="gradient"
          bgColor={'secondary'}
          color={"dark"}
          borderRadius="30px"
          display="flex"
          sx={{ position: "absolute", right: -15, top: -15 }}
          justifyContent="center"
          alignItems="center"
          width='30px'
          height='30px'
        >
          <Icon fontSize="medium" color="inherit">
            {'close'}
          </Icon>
        </MDBox>
        <MDBox lineHeight={1} display="flex" sx={{ flexDirection: 'column' }}>
          <MDTypography ml={1} color="text">MultiSelectorNode</MDTypography>
          {inputs.map((input) => (input))}
        </MDBox>
      </MDBox>
      <Handle
        type="target"
        className="w-2 h-2 bg-cyan-500"
        position={Position.Top}
        onConnect={onConnect}
      />
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={-1}
        mb={1}
      >
        <MDBox
          variant="gradient"
          bgColor={'success'}
          color={"dark"}
          coloredShadow={'success'}
          borderRadius='30px'
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={'30px'}
          height={'30px'}
          mx={0.5}
        >
          <IconButton fontSize="small" color="inherit" onClick={handleAddHandle}>
            <Icon fontSize="small" color="inherit">
              {'add'}
            </Icon>
          </IconButton>
        </MDBox>
        {inputs.length > 1 && <MDBox
          variant="gradient"
          bgColor={'warning'}
          color={"dark"}
          coloredShadow={'warning'}
          borderRadius='30px'
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={'30px'}
          height={'30px'}
          mx={0.5}
        >
          <IconButton fontSize="small" color="inherit" onClick={handleDeleteHandle}>
            <Icon fontSize="small" color="inherit">
              {'remove'}
            </Icon>
          </IconButton>
        </MDBox>}
      </MDBox>
    </Card>

  );
}

export default memo(MultiSelectorNode);
