import { Avatar, Box, Grow, Typography } from '@mui/material';
import React from 'react';
import { TypeAnimation } from 'react-type-animation';

import { Message, MessageContent } from '../chat-types';

export function MuiMessage({
  id,
  message,
  showDate,
  showTime,
}: {
  id: string;
  message: Message<MessageContent>;
  showDate: boolean;
  showTime: boolean;
}): React.ReactElement {
  if (message.deletedAt) {
    return <div id={id} />;
  }

  const dispDate = message.updatedAt ? message.updatedAt : message.createdAt;

  const ChatAvator = (
    <Box
      minWidth={0}
      flexShrink={0}
      ml={message.self ? 1 : 0}
      mr={message.self ? 0 : 1}
    >
      <Avatar alt={message.username} src={message.avatar} />
    </Box>
  );

  const ChatUsername = (
    <Box maxWidth="100%" mx={1}>
      <Typography variant="body2" align={message.self ? 'right' : 'left'}>
        {message.username}
      </Typography>
    </Box>
  );

  const ChatDate = (
    <Box maxWidth="100%" mx={1}>
      <Typography
        variant="body2"
        align={message.self ? 'right' : 'left'}
        color="textSecondary"
      >
        {dispDate?.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>
    </Box>
  );

  return (
    <Grow in>
      <Box maxWidth="100%" display="flex" flexDirection="column">
        {/* {showDate && (
          <Typography align="center">
            {dispDate?.toLocaleDateString()}
          </Typography>
        )} */}
        <Box
          id={id}
          maxWidth="100%"
          my={1}
          pl={message.self ? '20%' : 0}
          pr={message.self ? 0 : '20%'}
          display="flex"
          justifyContent={message.self ? 'flex-end' : 'flex-start'}
        // style={{ overflowWrap: 'break-word' }}
        >
          {message.avatar && !message.self && ChatAvator}
          {/* {!message.self && <div style={{ marginRight: '-4px', zIndex: 1 }}>
            <svg width="11px" height="18px" viewBox="0 0 11 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g id="Bot-designs" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="curve-arc" transform="translate(-801.000000, -515.000000)" fill="#fff">
                  <path d="M811.765059,515.001687 L811.765059,533.001687 L809.049187,533.001644 C809.064813,532.611087 809.072751,532.217023 809.072751,531.819869 C809.072751,523.836843 805.865565,517.10228 801.481527,515.00007 L811.765059,515.001687 Z" id="Combined-Shape" />
                </g>
              </g>
            </svg>
          </div>} */}
          <Box minWidth={0} display="flex" flexDirection="column">
            {message.username && ChatUsername}
            <Box
              maxWidth="100%"
              py={1}
              px={2}
              bgcolor={message.self ? 'primary.main' : 'background.paper'}
              color={message.self ? 'primary.contrastText' : 'text.primary'}
              borderRadius={!message.self ? '2px 12px 12px 12px' : '12px 2px 12px 12px'}
              boxShadow='0 1px 28px 0 rgba(59, 68, 164, 0.1)'
            >
              {message.type === 'text' && (
                // <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                //   {message.content}
                // </Typography>
                <TypeAnimation
                  sequence={[message.content as string]}
                  speed={50}
                  cursor={false}
                  style={{ fontSize: '16px', fontWeight: 600 }}
                />
              )}
              {message.type === 'jsx' && <div>{message.content}</div>}
            </Box>
            {/* {showTime && ChatDate} */}
          </Box>
          {message.avatar && message.self && ChatAvator}
        </Box>
      </Box>
    </Grow>
  );
}
