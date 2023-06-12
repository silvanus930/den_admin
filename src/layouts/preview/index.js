import { Box, Typography, } from '@mui/material';
import { ChatController, MuiChat, } from '../../examples/chatbotui';
import React, { useEffect, useState } from 'react';
import CustomizedMenus from './menu';
import { useLocation, useParams } from 'react-router-dom';
import { getSessionApi } from 'library/apis/session';
import { getConnectedEdges } from 'reactflow';
import { sendEmailToZapier } from 'library/apis/email';

export default function Preview() {

  const { id } = useParams();
  const location = useLocation();

  let resultData = {};

  const getColorFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    const color = '#' + queryParams.get('color');
    return color;
  };

  const color = getColorFromURL();
  const [isRedTheme, setIsRedTheme] = useState(true);
  const botThemeColor = color;

  const [botData, setBotData] = useState(null);

  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: true,
    }),
  );

  const handleMenuAction = (index) => {
    if (index === 'toggle') setIsRedTheme(!isRedTheme);
    else if (index === 'repeat') {
      chatCtl.clearMessages();
      chatCtl.cancelActionRequest();
      fetchData(id).catch(console.error);
    }
  }

  useEffect(() => {
    fetchData(id).catch(console.error);
  }, []);

  const fetchData = async (id) => {
    try {
      const data = await getSessionApi(id);
      setBotData(data.data);
    } catch (error) {
      console.log('PreviewData Error');
    }
  }

  useEffect(async () => {
    if (!botData?.nodes) return;

    const nodes = botData.nodes;
    const edges = botData.edges;

    let currentNode = nodes[0];
    let count = 0;
    while (true) {
      count++;
      if (currentNode.type === 'endNode' || count > 200) return;
      const result = await setActionByNode(currentNode);
      console.log('Result from this: ', currentNode, result);
      currentNode = getNextNode(nodes, edges, result, currentNode);
    }
  }, [botData]);

  function getNextNode(nodes, edges, result, node) {
    const linkedEdges = getConnectedEdges([node], edges);
    if (!linkedEdges) return { type: 'endNode' };

    if (node.type === 'startNode'
      || node.type === 'nameNode'
      || node.type === 'emailNode'
      || node.type === 'phoneNode'
      || node.type === 'imageNode'
      || node.type === 'sendEmailNode'
      || node.type === 'messageNode') {
      const linkedEdge = linkedEdges.find(edge => edge.source === node.id)
      let data = result?.result?.value;
      if (node.type === 'nameNode') {
        const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (!regex.test(data)) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'Pleae input valid name.' });
          return node;
        }
        data = data.split(' ')[0];
      }
      else if (node.type === 'phoneNode') {
        const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!regex.test(data)) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'Pleae input valid phone number.' });
          return node;
        }
      }
      else if (node.type === 'emailNode') {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(data)) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'Pleae input valid email.' });
          return node;
        }
      }
      else if (node.type === 'sendEmailNode') {
        sendEmailToZapier(node?.data, chatCtl.getMessages());
      }
      resultData[node.id] = data;
      console.log('ResultData in this node', node.id, data, resultData);
      const nextNode = nodes.find(node => node.id === linkedEdge.target);
      return nextNode;
    } else if (node.type === 'multiSelectorNode' || node.type === 'conditionalNode') {
      const index = node.data.texts.findIndex(text => text === result?.result?.value);
      const linkedEdge = linkedEdges.find(edge => (edge.source === node.id && (edge.sourceHandle === `handle-${index}` || index === 0)));
      const nextNode = nodes.find(node => node.id === linkedEdge.target);
      resultData[node.id] = result?.result?.value;
      console.log('ResultData in this node', node.id, resultData);
      return nextNode;
    }
    return { type: 'endNode' };
  }

  function getNodeValue(node) {
    const regex = /node[-]?([\d]+)(\.text|\.value)*/;
    const match = node.match(regex);
    return 'node-' + match[1];
  }

  function replaceNodePlaceholders(string) {
    const pattern = /{([^}.]+(\.[^}.]+)?)}/g;
    return string.replace(pattern, (match, node) => {
      const nodeValue = resultData[getNodeValue(node)] || '--';
      return `${nodeValue}`;
    });
  }

  const setActionByNode = async node => {
    if (node.type === 'nameNode') {
      const result = await chatCtl.setActionRequest({ type: 'text', placeholder: 'Please enter your name.', });
      console.log('Result: ', result);
      return { type: node.type, result };

    } else if (node.type === 'emailNode') {
      const result = await chatCtl.setActionRequest({ type: 'text', placeholder: 'Please enter your email address.', });
      return { type: node.type, result };

    } else if (node.type === 'phoneNode') {
      const result = await chatCtl.setActionRequest({ type: 'text', placeholder: 'Please enter your phone number.', });
      return { type: node.type, result };

    } else if (node.type === 'imageNode') {
      const result = await chatCtl.addMessage({ type: 'jsx', avatar: botData?.avatar, content: `<span style="font-size: 16px; font-weight: 400; font-family: Inter;">${replaceNodePlaceholders(node.data.text)}</span><img src=${node.data.uri} alt="File" style="width: 250px; height: auto; border-radius: 16px; margin-top: 3px;" data-nsfw-filter-status="sfw">` });
      return { type: node.type, result };

    } else if (node.type === 'messageNode') {
      const result = await chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: replaceNodePlaceholders(node.data.text) });
      return { type: node.type, result };

    } else if (node.type === 'sendEmailNode') {
      return { type: node.type, result: { value: node?.data?.text } };

    } else if (node.type === 'multiSelectorNode' || node.type === 'conditionalNode') {
      const options = node.data.texts.map((text) => ({ value: text, text: text }))
      const result = await chatCtl.setActionRequest({
        type: 'select',
        options: options,
      });
      await chatCtl.addMessage({ type: 'button', avatar: botData?.avatar, buttons: node.data.texts, value: result.value });
      return { type: node.type, result };
    }
  }

  return (
    <Box sx={{
      height: '80vh',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      position: 'absolute',
      bottom: 70,
      display: "flex",
      borderWidth: 1,
      lineHeight: '19.36px',
      borderColor: '#00000010',
      flexDirection: "column",
    }}>
      <Box flexDirection='row' display="flex" m={1.5} justifyContent='center' alignItems='center'>
        <Typography
          sx={{
            color: botThemeColor,
            textAlign: 'left',
            flex: 1,
            marginLeft: 1,
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: 500
          }}>
          {`Welcome to Denbot!`}
        </Typography>
        <CustomizedMenus handleMenuAction={handleMenuAction} color={botThemeColor} />
      </Box>
      <Box
        px={1}
        style={{
          overflowY: 'scroll',
          flex: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#00000010'
        }}>
        <MuiChat chatController={chatCtl} color={botThemeColor} />
      </Box>
      <Box>
        <Typography
          sx={{
            color: '#00000050',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '13.31px',
            fontFamily: 'Inter',
            margin: '6px',
          }}>
          powered by <a href="http://13.56.98.6" style={{ color: getColorFromURL() }}>Denbot</a>
        </Typography>
      </Box>
    </Box>
  );
}