import { Avatar, Box, Grow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { BeatLoader } from 'react-spinners';

import { Message, MessageContent } from '../chat-types';
import avatar from "assets/images/team-1.jpg";

export function MuiMessage({
  id,
  message,
  color,
}: {
  id: string;
  message: Message<MessageContent>;
  color: string;
}): React.ReactElement {

  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, !message?.self ? 1000 : 0);

    return () => clearTimeout(timer);
  }, []);

  if (message.deletedAt) {
    return <div id={id} />;
  }

  const ChatAvator = (
    <Box
      minWidth={0}
      flexShrink={0}
      ml={message.self ? 1 : 0}
      mr={message.self ? 0 : 1}
    >
      <Avatar alt={message.username} src={avatar} />
    </Box>
  );

  return (
    <Grow in>
      <Box maxWidth="100%" display="flex" flexDirection="column">
        <Box
          id={id}
          maxWidth="100%"
          my={1}
          pl={message.self ? '10%' : 0}
          pr={message.self ? 0 : '10%'}
          display="flex"
          justifyContent={message.self ? 'flex-end' : 'flex-start'}
        >
          {message.avatar && !message.self && ChatAvator}
          <Box minWidth={0} display="flex" flexDirection="column">
            <Box
              maxWidth="100%"
              py={1}
              px={2}
              bgcolor={!message.self ? color + '1A' : '#0000000A'}
              borderRadius={'6px'}
            >
              {showIndicator ? <BeatLoader color={color} size={10} /> :
                message.type === 'text' && (
                  <TypeAnimation
                    sequence={[message.content as string]}
                    speed={50}
                    cursor={false}
                    style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter' }}
                  />
                )
              }
              {message.type === 'jsx' && <div>{message.content}</div>}

            </Box>
          </Box>
          {message.avatar && message.self && ChatAvator}
        </Box>
      </Box>
    </Grow>
  );
}
