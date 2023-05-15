import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Icon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ActionRequest,
  ChatController,
  FileActionResponse,
  MuiChat,
} from '../../examples/chatbotui';
import React, { useState } from 'react';
import CustomizedMenus from './menu';
import EmbedChatBot from 'examples/EmbedChatBot';

export default function Preview() {

  const [isRedTheme, setIsRedTheme] = useState(true);
  const botThemeColor = !isRedTheme ? '#F06750' : '#376FFF';

  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: true,
    }),
  );

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  const handleMenuAction = (id) => {
    id === 'toggle' && setIsRedTheme(!isRedTheme);
  }

  return (
    <Box sx={{
      height: '80vh',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      position: 'absolute',
      bottom: 70,
    }}>
      <Box flexDirection='row' display="flex" m={1.5} justifyContent='center' alighItems='center'>
        <Typography sx={{ color: botThemeColor, textAlign: 'center', flex: 1, display: 'flex', justifyContent: 'center' }}>Welcome to Denbot!</Typography>
        <CustomizedMenus handleMenuAction={handleMenuAction} color={botThemeColor} />
      </Box>
      <Box px={1} sx={{ height: '85%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#00000020' }}>
        <MuiChat chatController={chatCtl} color={botThemeColor} />
      </Box>
      <Box>
        <Typography sx={{ color: '#00000020', textAlign: 'center' }}>powered by Denbot</Typography>
      </Box>
    </Box>
  );
}

async function echo(chatCtl) {
  await chatCtl.addMessage({
    type: 'text',
    content: `Good morning, welcome to Clear Smiles & CS Aesthetics with Dr Chetan Sharma 😀.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Dr Chet is an award-winning Elite Apex provider of Invisalign in the Midlands.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `I'm Dentry Bot, here to help with your question about the dental.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `May I ask your name, please?`,
    self: false,
    avatar: '-',
  });
  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter your name',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks, ${text.value}`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `${text.value}, what would you like to do?`,
    self: false,
    avatar: '-',
  });
  const sel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'sel_1',
        text: 'Book a FREE Invisalign consultation',
      },
      {
        value: 'sel_2',
        text: 'Book a consultation for Facial Aesthetics',
      },
      {
        value: 'sel_3',
        text: 'Request a call back',
      },
      {
        value: 'sel_4',
        text: 'Make an enquiry about our dental treatments',
      },
      {
        value: 'sel_5',
        text: 'Keep Browsing',
      },

    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Awesome!, You have selected ${sel.value}.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Being awarded Elite Apex status means Dr Chet is in the top 1% of Invisalign providers for Europe.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `We now need to collect a few details to pass onto the team, in line with our privacy policy`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `We take your privacy very seriously and do not share data`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `is that ok?`,
    self: false,
    avatar: '-',
  });
  const mulSel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'ok',
        text: 'Yes, I agree',
      },
      {
        value: 'no',
        text: `No, I don't`,
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `I understand what do you correctly want.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Can you send me your selfie to see the what I have to assist you?`,
    self: false,
    avatar: '-',
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  }));
  await chatCtl.addMessage({
    type: 'jsx',
    content: (
      <div>
        {file.files.map((f) => (
          <img
            key={file.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
    avatar: '-',
  });

  // await chatCtl.addMessage({
  //   type: 'text',
  //   content: `Please enter your voice.`,
  //   self: false,
  //   avatar: '-',
  // });
  // const audio = (await chatCtl
  //   .setActionRequest({
  //     type: 'audio',
  //   })
  //   .catch(() => ({
  //     type: 'audio',
  //     value: 'Voice input failed.',
  //     avatar: '-',
  //   }))) as AudioActionResponse;
  // await (audio.audio
  //   ? chatCtl.addMessage({
  //     type: 'jsx',
  //     content: (
  //       <a href={window.URL.createObjectURL(audio.audio)}>Audio downlaod</a>
  //     ),
  //     self: false,
  //     avatar: '-',
  //   })
  //   : chatCtl.addMessage({
  //     type: 'text',
  //     content: audio.value,
  //     self: false,
  //     avatar: '-',
  //   }));

  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks ${text.value}, nice to talk with you`,
    self: false,
    avatar: '-',
  });
  const good = await chatCtl.setActionRequest({
    type: 'custom',
    Component: GoodInput,
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Bye!!`,
    self: false,
    avatar: '-',
  });

  echo(chatCtl);
}
async function echo1(chatCtl) {
  await chatCtl.addMessage({
    type: 'text',
    content: `Good morning, welcome to Clear Smiles & CS Aesthetics with Dr Chetan Sharma 😀.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `May I ask your name, please?`,
    self: false,
    avatar: '-',
  });
  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter your name',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks, ${text.value}`,
    self: false,
    avatar: '-',
  });

  await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter your name',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks, ${text.value}`,
    self: false,
    avatar: '-',
  });

  await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter your name',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks, ${text.value}`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `${text.value}, what would you like to do?`,
    self: false,
    avatar: '-',
  });
  const sel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'sel_1',
        text: 'Book a FREE Invisalign consultation',
      },
      {
        value: 'sel_2',
        text: 'Book a consultation for Facial Aesthetics',
      },
      {
        value: 'sel_3',
        text: 'Request a call back',
      },
      {
        value: 'sel_4',
        text: 'Make an enquiry about our dental treatments',
      },
      {
        value: 'sel_5',
        text: 'Keep Browsing',
      },

    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `Awesome!, You have selected ${sel.value}.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Being awarded Elite Apex status means Dr Chet is in the top 1% of Invisalign providers for Europe.`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `We now need to collect a few details to pass onto the team, in line with our privacy policy`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `We take your privacy very seriously and do not share data`,
    self: false,
    avatar: '-',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `is that ok?`,
    self: false,
    avatar: '-',
  });
  const mulSel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'ok',
        text: 'Yes, I agree',
      },
      {
        value: 'no',
        text: `No, I don't`,
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `I understand what do you correctly want.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Can you send me your selfie to see the what I have to assist you?`,
    self: false,
    avatar: '-',
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  }));
  await chatCtl.addMessage({
    type: 'jsx',
    content: (
      <div>
        {file.files.map((f) => (
          <img
            key={file.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Thanks ${text.value}, nice to talk with you`,
    self: false,
    avatar: '-',
  });

  echo1(chatCtl);
}

function GoodInput({
  chatController,
  actionRequest,
}) {
  const chatCtl = chatController;

  const setResponse = React.useCallback(() => {
    const res = { type: 'custom', value: 'Bye!' };
    chatCtl.setActionResponse(actionRequest, res);
  }, [actionRequest, chatCtl]);

  return (
    <div>
      <Button
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
      >
        Bye!
      </Button>
    </div>
  );
}
