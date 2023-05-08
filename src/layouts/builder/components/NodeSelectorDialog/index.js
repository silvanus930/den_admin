import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export default function NodeSelectorDialog(props) {
    const { onClose, selectedValue, open } = props;

    /* 
        selectorNode
        multiSelectorNode
        thinkNode
        startNode
        endNode
   */

    const nodeData = ['selectorNode', 'multiSelectorNode', 'thinkNode', 'startNode', 'endNode'];

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth={true}>
            <List sx={{ pt: 0, margin: 4 }}>
                {nodeData.map((node) => (
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleListItemClick(node)} key={node}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={node} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}