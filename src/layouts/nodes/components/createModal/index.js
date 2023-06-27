import { useState, forwardRef, useRef } from 'react';
import { DotLoader } from 'react-spinners';
import { TwitterPicker } from 'react-color';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Paper from '@mui/material/Paper';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';

import MDBox from 'components/MDBox';
import { uploadFile } from 'library/apis/s3Upload';
import { updateSessionApi } from 'library/apis/session';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateModal({ item, open, setOpen, fetchData }) {

    const ref = useRef(null);

    const [name, setName] = useState(item?.name || '');
    const [zapierUrl, setZapierUrl] = useState(item?.zapierUrl || '');
    const [bubbleText, setBubbleText] = useState(item?.bubbleText || '');
    const [isBubbleEnabled, setIsBubbleEnabled] = useState(!!item?.isBubbleEnabled);
    const [avatar, setAvatar] = useState(item?.avatar || '');
    const [color, setColor] = useState(item?.color || '#FF6900');

    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setIsUploading(false);
        setOpen(false);
        fetchData().catch(console.error);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            console.log('Data: ', item);
            await updateSessionApi(item?._id, { 
                name: name, 
                avatar: avatar, 
                color: color, 
                zapierUrl: zapierUrl, 
                bubbleText: bubbleText,
                isBubbleEnabled: isBubbleEnabled });
            setIsLoading(false);
        } catch (error) {
            console.log('Update Session Error:', error);
            setIsLoading(false);
        }
        handleClose();
    }

    const handleChange = async event => {
        setIsUploading(true);
        const fileUploaded = event.target.files[0];
        try {
            const s3Url = await uploadFile(fileUploaded);
            setAvatar(s3Url);
            setIsUploading(false);
        } catch (error) {
            setIsUploading(false);
            console.log(error);
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
            <Paper elevation={3} sx={{ padding: '10px', backgroundColor: '#202A40' }}>
                <Typography variant='h5' p={2}>{"Please Input your bot information"}</Typography>
                <Divider sx={{ margin: 0 }} />
                <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
                        <MDBox
                            variant="gradient"
                            bgColor="dark"
                            color="white"
                            coloredShadow="dark"
                            borderRadius="xl"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="6rem"
                            height="6rem"
                            m={2}
                        >
                            {!avatar.length ?
                                <Icon fontSize="medium" color="inherit">message</Icon> :
                                <MDBox width="6rem" height="6rem" component="img" src={avatar} sx={{ borderRadius: 3, borderWidth: 4, borderColor: color }} />
                            }
                        </MDBox>
                        <Box sx={{ marginLeft: -2.5, marginTop: "4.5rem", display: 'flex', justifyContent: 'flex-end' }}>
                            {!isUploading && <IconButton onClick={() => { ref.current.click() }} sx={{ color: '#cccccc', marginLeft: -2 }}><CameraAltIcon /></IconButton>}
                            {isUploading && <DotLoader color={'#ffffff'} size={10} />}
                        </Box>
                        <Box m={2}>
                            <TwitterPicker
                                triangle='hide'
                                onChange={(e) => { setColor(e.hex) }}
                            />
                        </Box>
                    </Box>
                    <Box ml={1}>
                        <TextField
                            margin="dense"
                            label="Input Your Bot Name"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {/* <TextField
                            margin="dense"
                            label="Input Zapier Url to send Email"
                            fullWidth
                            variant="standard"
                            value={zapierUrl}
                            onChange={(e) => setZapierUrl(e.target.value)}
                        /> */}
                        <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'flex-end' }}>
                            <Checkbox
                                checked={isBubbleEnabled}
                                onChange={(e) => setIsBubbleEnabled(e.target.checked)}
                            />
                            <TextField
                                margin="dense"
                                label="Input Your Bot Bubble Text"
                                fullWidth
                                variant="standard"
                                value={bubbleText}
                                disabled={!isBubbleEnabled}
                                onChange={(e) => setBubbleText(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button sx={{ marginTop: 1, borderColor: 'white' }} onClick={handleSave}>Save</Button>
                        </Box>
                        <input
                            id="myInput"
                            type="file"
                            accept={"image/*"}
                            ref={ref}
                            onChange={handleChange}
                            style={{ display: 'none' }} />
                    </Box>
                </Box>
            </Paper>
        </Dialog>
    );
}
