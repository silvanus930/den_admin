import { Box, Button } from '@mui/material';
import React from 'react';

import { ChatController } from '../chat-controller';
import { SelectActionRequest, SelectActionResponse } from '../chat-types';

export function MuiSelectInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: SelectActionRequest;
}): React.ReactElement {
  const chatCtl = chatController;

  const setResponse = React.useCallback(
    (value: string): void => {
      const option = actionRequest.options.find((o) => o.value === value);
      if (!option) {
        throw new Error(`Unknown value: ${value}`);
      }
      const res: SelectActionResponse = {
        type: 'select',
        value: option.text,
        option,
      };
      chatCtl.setActionResponse(actionRequest, res);
    },
    [actionRequest, chatCtl],
  );

  return (
    <Box
      sx={{
        margin: 1,
        borderRadius: 2,
        flex: '1 1 auto',
        display: 'flex',
        background: '#00000022',
        padding: 1,
        flexDirection: 'column',
        '& > *': {
          flex: '0 0 auto',
          maxWidth: '100%',
        },
        '& > * + *': {
          mt: 1,
        },
      }}
    >
      {actionRequest.options.map((o) => (
        <Button
          key={actionRequest.options.indexOf(o)}
          type="button"
          // color="success"
          // variant="outlined"
          variant="contained"
          value={o.value}
          onClick={(e): void => setResponse(e.currentTarget.value)}
          sx={{
            margin: 1, background: '#ffffff', color: '#000000', textAlign: 'left !important', '&:hover': { background: '#ccc', color: '#000' }
          }}
        >
          {o.text}
        </Button>
      ))}
    </Box>
  );
}
