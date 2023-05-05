import { Box, Button, Icon, TextField, Input, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React from 'react';

import { ChatController } from '../chat-controller';
import { TextActionRequest, TextActionResponse } from '../chat-types';

export function MuiTextInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: TextActionRequest;
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
        flex: '1 1 auto',
        display: 'flex',
        '& > *': {
          flex: '1 1 auto',
          minWidth: 0,
        },
        '& > * + *': {
          ml: 1,
        },
      }}
    >
      <Input
        placeholder={actionRequest.placeholder}
        value={value}
        onChange={(e): void => setValue(e.target.value)}
        startAdornment={
          <Icon sx={{ ml: 2, mr: 1 }} fontSize="medium" color="action">person</Icon>
        }
        endAdornment={
          <IconButton sx={{
            mr: 1, background: '#192230', color: 'Background', transform: 'rotate(-30deg)',
            transition: 'transform 0.3s ease-in-out', '&:hover': {
              background: '#192230ee', transform: 'rotate(0deg)'
            },
          }} onClick={setResponse} aria-label="add to shopping cart">
            <Icon sx={{ ml: '3px' }}>send</Icon>
          </IconButton>
        }
        style={{
          background: 'white', borderRadius: 100, borderColor: 'red', borderWidth: '0', marginRight: 10,
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
