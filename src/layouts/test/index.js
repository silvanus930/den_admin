
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';

import EmbedChatBot from 'examples/EmbedChatBot'
import { BOT_URL } from 'library/constant';

function Test() {

    const { id } = useParams();
    const location = useLocation();

    const [copyState, setCopystate] = useState(false);

    const getColorFromURL = () => {
        const queryParams = new URLSearchParams(location.search);
        const color = '#' + queryParams.get('color');
        return color;
    };

    const color = getColorFromURL();
    const getText = () => {
        return `<script src="${BOT_URL}denbot.js" botId="${id}" button-color="${color}"></script>`;
    }

    return (
        <DashboardLayout>
            <MDBox pt={6} pb={3} sx={{ width: '50vw', height: "100vh", }} >
                <MDTypography pb={2} variant="h3">Test & Deploy</MDTypography>
                <Tooltip title={copyState ? `Copied!` : 'To the deploy this bot to your site you can just copy this tag to the your html file. Click board!'}>
                    <Button onMouseEnter={() => setCopystate(false)} onClick={() => { setCopystate(true) }}>
                        <CopyToClipboard text={getText()}>
                            <MDBox sx={{ borderWidth: 1, borderColor: '#ffffff', borderRadius: '10px', maxWidth: '50vw', padding: '10px' }}>
                                <MDTypography variant="h6" sx={{wordWrap: 'break-word'}}>{getText()}</MDTypography>
                            </MDBox>
                        </CopyToClipboard>
                    </Button>
                </Tooltip>
                <EmbedChatBot id={id} color={color} />
            </MDBox>
        </DashboardLayout>
    );
}

export default Test;
