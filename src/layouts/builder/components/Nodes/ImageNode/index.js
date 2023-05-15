import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Box, Button, IconButton, Icon, TextField, Input, Card, Divider, colorManipulator } from '@mui/material';
import React, { memo, useCallback, useState } from "react";

import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { Handle, Position, useOnViewportChange } from "reactflow";

const onConnect = (params) => console.log("handle onConnect", params);

const TextInput = ({ text, setText }) => {
  return (
    <Input
      placeholder={'Please input image descriptiop and upload the image'}
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{
        background: 'white',
        borderRadius: 8,
        borderColor: 'red',
        margin: 5,
        padding: 5,
        overflow: 'hidden',
        width: '300px'
      }}
      autoFocus
      disableUnderline
      multiline
      maxRows={3}
      rows={2}
    />
  );
}

function ImageNode({ data }) {

  const onStart = useCallback((viewport) => console.log("onStart", viewport), []);
  const onChange = useCallback((viewport) => console.log("onChange", viewport), []);
  const onEnd = useCallback((viewport) => console.log("onEnd", viewport), []);

  const [text, setText] = useState(data?.text || '');

  const [file, setFile] = useState(null);
  const [imageUri, setImageUri] = useState('');

  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setImageUri(window.URL.createObjectURL(fileUploaded))
    setFile(fileUploaded);
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
          <Icon fontSize="medium" color="inherit">{'message'}</Icon>
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
        <MDBox display="flex" sx={{ flexDirection: 'column' }}>
          <MDTypography ml={1} color="text">Image Node</MDTypography>
          <TextInput
            text={text}
            setText={setText} />
          <MDButton
            variant="contained"
            color="warning"
            onClick={handleClick}
            style={{ margin: 5 }}>
            {!file ? 'Load' : 'Update'}
          </MDButton>
          <input
            type="file"
            ref={hiddenFileInput}
            accept={"image/*"}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          {file && (
            <img
              src={imageUri}
              alt="File"
              style={{ width: '300px', height: 'auto', borderRadius: 16 }}
            />
          )}
        </MDBox>
      </MDBox>
      <Handle
        type="target"
        className="w-3 h-3 bg-cyan-500"
        position={Position.Top}
        onConnect={onConnect}
      />
      <Handle
        type="source"
        className="w-3 h-3 bg-blue-900"
        position={Position.Bottom}
        id={'handle-0'}
      />
    </Card>

  );
}

export default memo(ImageNode);
