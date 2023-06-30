import { Box, Button, Icon, TextField, Input, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import React from 'react';

import { ChatController } from '../chat-controller';
import { TextActionRequest, TextActionResponse } from '../chat-types';

export function MuiTextInput({
  chatController,
  actionRequest,
  color,
}: {
  chatController: ChatController;
  actionRequest: TextActionRequest;
  color: string;
}): React.ReactElement {
  const chatCtl = chatController;
  const [value, setValue] = React.useState(actionRequest.defaultValue);

  const setResponse = React.useCallback((): void => {
    if (value) {
      const res: TextActionResponse = { type: 'text', value };
      chatCtl.setActionResponse(actionRequest, res);
      setValue('');
    }
  }, [actionRequest, chatCtl, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setResponse();
      }
    },
    [setResponse],
  );

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 auto',
        display: 'flex',
        '& > *': {
          flex: '1 1 auto',
          minWidth: 0,
        },
        '& > * + *': {
          ml: 1,
        },
        borderRadius: 2,
        borderWidth: 1,
      }}
    >
      <Input
        placeholder={actionRequest.placeholder}
        value={value}
        onChange={(e): void => setValue(e.target.value)}
        endAdornment={
          <IconButton sx={{
            borderRadius: '8px',
            margin: '3px',
            background: color + '19' ,'&:hover': {
              background: color + '29',
            },
          }} onClick={setResponse} aria-label="add to shopping cart">
            <ArrowUpward sx={{ color: color }} />
          </IconButton>
        }
        style={{
          background: 'white', 
          borderRadius: 10, 
          borderColor: 'red', 
          borderWidth: '0', 
          marginRight: 6, 
          paddingLeft: 10, color: 'black'
        }}
        autoFocus
        disableUnderline
        multiline
        inputProps={{ onKeyDown: handleKeyDown }}
        maxRows={10}
      />
    </Box>
  );
}
