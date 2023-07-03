import React, { memo, useEffect, useState } from 'react';
import { getConnectedEdges, updateEdge } from 'reactflow';
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography, } from '@mui/material';

import { ChatController, MuiChat, } from '../../examples/chatbotui';

import { getSessionApi } from 'library/apis/session';
import CustomizedMenus from './menu';
import { sendEmailToZapier } from 'library/apis/email';

import { TrackGoogleAnalyticsEvent } from 'utils/googleAnalytics';

function Preview() {

  const { id } = useParams();
  const location = useLocation();

  let count = 0;
  let nodes = [];
  let edges = [];

  const [resultData, setResultData] = useState({});
  const [isRedTheme, setIsRedTheme] = useState(true);
  const [botData, setBotData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  const getColorFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    const color = '#' + queryParams.get('color');
    return color;
  };

  const color = getColorFromURL();
  const botThemeColor = color;

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
      console.log('Bot Data: ', data);
    } catch (error) {
      console.log('PreviewData Error');
    }
  }

  useEffect(async () => {
    if (!botData?.nodes) return;
    nodes = botData.nodes;
    edges = botData.edges;
    setCurrentNode(botData.nodes[0]);
  }, [botData]);

  useEffect(async () => {
    if (!currentNode) return;
    console.log('CurrentNode: ', currentNode);
    await doAction();
  }, [currentNode]);

  const doAction = async () => {
    count++;
    nodes = botData.nodes;
    edges = botData.edges;
    if (currentNode.type === 'endNode' || count > 200) {
      handleCloseBot();
      return;
    }

    const result = await setActionByNode(currentNode);
    console.log('Result from this: ', currentNode, result);
    setCurrentNode({ ...getNextNode(nodes, edges, result, currentNode), number: count });
  }

  function getNextNode(nodes, edges, result, node) {
    const linkedEdges = getConnectedEdges([node], edges);
    if (!linkedEdges) return { type: 'endNode' };

    if (node.type === 'startNode'
      || node.type === 'nameNode'
      || node.type === 'textNode'
      || node.type === 'emailNode'
      || node.type === 'phoneNode'
      || node.type === 'imageNode'
      || node.type === 'sendEmailNode'
      || node.type === 'googleAnalyticsNode'
      || node.type === 'messageNode') {
      const linkedEdge = linkedEdges.find(edge => edge.source === node.id)
      let data = result?.result?.value;
      if (node.type === 'nameNode') {
        const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (!regex.test(data)) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'That name appeares to be incorrect, please enter a valid name.' });
          return node;
        }
        data = data.split(' ')[0];
        console.log('Name Data ==========> ', data);
      }

      else if (node.type === 'phoneNode') {

        if (!(isValidPhoneNumber(data) || isValidPhoneNumber(`+44${data}`))) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'That number appeares to be incorrect, please enter a valid phone number.' });
          return node;
        }
      }

      else if (node.type === 'emailNode') {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(data)) {
          chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: 'That email appeares to be incorrect, please enter a valid email.' });
          return node;
        }
      }

      else if (node.type === 'sendEmailNode') {
        (async () => {
          const data = JSON.parse(node?.data?.text);
          console.log('====Original Data => ', data);
          Object.keys(data).forEach(key => {
            data[key] = replaceNodePlaceholders(data[key]);
          });

          console.log('====Updated Data => ', data);

          const result = await sendEmailToZapier(data, chatCtl.getMessages());
          console.log('Email Result: ', result?.code ? result.code.toString() : '');
          setResultData({ ...resultData, [node.id]: result?.code ? result.code.toString() : '' })
        })();
        const nextNode = nodes.find(node => node.id === linkedEdge.target);
        return nextNode;
      }

      else if (node.type === 'googleAnalyticsNode') {
        try {
          const data = JSON.parse(node?.data?.text);
          console.log('GA data: ', node?.data?.text);
          console.log('GA data===: ', data);
          TrackGoogleAnalyticsEvent(data?.id || 'b', data?.category || 'b', data?.action || 'b', data?.event || 'b');
        } catch (error) {
          TrackGoogleAnalyticsEvent('a', 'a', 'a', 'a');
        }
      }

      setResultData({ ...resultData, [node.id]: data })
      const nextNode = nodes.find(node => node.id === linkedEdge.target);
      return nextNode;

    } else if (node.type === 'multiSelectorNode' || node.type === 'conditionalNode') {
      const index = node.data.texts.findIndex(text => text === result?.result?.value);
      const linkedEdge = linkedEdges.find(edge => (edge.source === node.id && (edge.sourceHandle === `handle-${index}` || index === 0)));
      const nextNode = nodes.find(node => node.id === linkedEdge.target);
      setResultData({ ...resultData, [node.id]: result?.result?.value })
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

    } else if (node.type === 'textNode') {
      const result = await chatCtl.setActionRequest({ type: 'text', placeholder: 'Please enter your question.', });
      return { type: node.type, result };

    } else if (node.type === 'imageNode') {
      const result = await chatCtl.addMessage({ type: 'jsx', avatar: botData?.avatar, content: `<span style="font-size: 16px; font-weight: 400; font-family: Inter;">${replaceNodePlaceholders(node.data.text)}</span><img src=${node.data.uri} alt="File" style="width: 250px; height: auto; border-radius: 16px; margin-top: 3px;" data-nsfw-filter-status="sfw">` });
      return { type: node.type, result };

    } else if (node.type === 'messageNode') {
      const result = await chatCtl.addMessage({ type: 'text', avatar: botData?.avatar, content: replaceNodePlaceholders(node.data.text), nodeID: node.id });
      return { type: node.type, result };

    } else if (node.type === 'sendEmailNode') {
      return { type: node.type, result: { value: node?.data?.text } };

    } else if (node.type === 'googleAnalyticsNode') {
      return { type: node.type, result: { value: node?.data?.text } };

    } else if (node.type === 'multiSelectorNode' || node.type === 'conditionalNode') {
      const options = node.data.texts.map((text) => ({ value: text, text: text }))
      const result = await chatCtl.setActionRequest({
        type: 'select',
        options: options,
      });
      // await chatCtl.addMessage({ type: 'button', avatar: botData?.avatar, buttons: node.data.texts, value: result.value });
      return { type: node.type, result };
    }
  }

  function handleCloseBot() {
    setTimeout(() => {
      try {
        parent.window.postMessage({ action: 'closeBotModal' }, '*');
        console.log('---Post Successed!!! closeBotModal');
      } catch (error) {
        console.log('---Error: ', error);
      }
    }, 2000); // Delay in milliseconds (2 seconds)
  }


  function handleLink() {
    const link = 'https://www.denbot.co.uk';
    try {
      parent.window.postMessage({ action: 'openDenBotSite', link: link }, '*');
      console.log('---Post Successed!!!');
    } catch (error) {
      console.log('---Error: ', error);
    }
  }

  return (
    <Box sx={{
      height: '80vh',
      width: '100%',
      maxWidth: '80vw',
      marginLeft: '50px',
      boxShadow: '0px 0px 50px 0px rgba(19, 2, 0, 0.04)',
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
          {`Welcome to ${botData?.name ? botData?.name : `Denbot`}`}
        </Typography>
        <CustomizedMenus handleMenuAction={handleMenuAction} color={botThemeColor} />
      </Box>
      {
        !botData?.isDisable && <>
          <Box
            id="scrollContainer"
            px={1}
            style={{
              overflowY: 'scroll',
              flex: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#00000010',
            }}>
            <MuiChat
              chatController={chatCtl}
              color={botThemeColor}
              setCurrentNode={(nodeId) => {
                console.log('Clicked on preview: ', nodeId);
                setCurrentNode(nodes.find(node => node.id == nodeId));

                const scrollContainer = document.getElementById('scrollContainer');
                if (scrollContainer) {
                  scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }

              }}
            />
          </Box>
        </> ||
        <>
          <Box
            id="scrollContainer"
            px={1}
            style={{
              overflowY: 'scroll',
              flex: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#00000010'
            }}>
            <Typography
              sx={{
                color: '#00000050',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: '28px',
                fontFamily: 'Inter',
                margin: '6px',
              }}>
              Your bot is disabled by admin, you should contact denbot support team.
            </Typography>
          </Box>
        </>
      }
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
          powered by <button onClick={handleLink} style={{ color: getColorFromURL() }}>Denbot</button>
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(Preview);