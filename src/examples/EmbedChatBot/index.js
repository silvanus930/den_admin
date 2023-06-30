import React, { useEffect, useState } from 'react';
import "./bot.css";
import "reactflow/dist/style.css";
import { BOT_URL } from 'library/constant';

function EmbedChatBot({ id, color, bubbleText = '' }) {

  const [showIframe, setShowIframe] = useState(false);
  const [initial, setInitial] = useState(false);

  const toggleIframe = () => {
    console.log('Close Called!');
    !initial && setInitial(true);
    setShowIframe(!showIframe);
  };

  useEffect(() => toggleIframe(), []);

  useEffect(() => checkAndRegisterEventListener(), []);

  // Define the event handler function
  function messageHandler(event) {
    console.log('Received message:', event.data);
    if (event.data.action === 'closeBotModal') toggleIframe();
    if (event.data.action === 'openDenBotSite') parent.window.open(event.data.link, '_blank');
  }

  // Check if the event listener is already registered
  var isEventListenerRegistered = false; // Flag to track registration status

  function checkAndRegisterEventListener() {
    if (!isEventListenerRegistered) {
      // Add event listener
      window.addEventListener('message', messageHandler);
      isEventListenerRegistered = true;
      console.log('Event listener registered.');
    } else {
      console.log('Event listener already registered.');
    }
  }

  // Remove the existing event listener and register again
  function removeAndRegisterEventListener() {
    if (isEventListenerRegistered) {
      // Remove the event listener
      window.removeEventListener('message', messageHandler);
      isEventListenerRegistered = false;
      console.log('Event listener removed.');
    }
    checkAndRegisterEventListener();
  }

  return (
    <>
      {initial && <div
        style={{ height: '100%', minWidth: '400px', maxWidth: '30vw', width: '100%', maxHeight: '80vh', minHeight: '600px', padding: 10, right: '-2%', marginBottom: 5 }}
        className={`zIndexInfinite fixed right-0 bottom-0 h-full ${showIframe ? 'app-active' : 'app-inActive'}`}>
        <iframe
          id={`iframe-bot-${id}`}
          src={`${BOT_URL}preview/${id}?color=${color.substring(1)}`}
          style={{ height: '100%', width: '100%', }}
        />
      </div>}

      <div
        className={`bot-right bot-eb-trigger bot-active tooltip`}
        id="eb-bot-trigger"
        onClick={toggleIframe}
      >

        <div class={`${!showIframe ? `tooltiptext` : `tooltiphide`}`} style={{ display: bubbleText?.length == 0 ? 'none' : '' }}>
          <p style={{ color: color, fontSize: '15px', fontWeight: 600, whiteSpace: 'pre' }}>{bubbleText}</p>
          <span class="triangle"></span>
        </div>

        <span
          className="round-container"
          style={{ background: color ? color : '#F0675A' }}>
          <svg className={`${!showIframe ? 'button-active svg-animation fade-in-animation' : 'button-inactive svg-animation fade-out-animation'}`} width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.95 0H4.05C1.755 0 0 1.755 0 4.05V17.55C0 19.845 1.755 21.6 4.05 21.6H18.2247C19.816 21.6 21.3421 22.2321 22.4674 23.3574L24.705 25.595C25.245 26.135 26.055 26.135 26.595 25.595C26.865 25.325 27 25.055 27 24.65V4.05C27 1.755 25.245 0 22.95 0ZM14.85 14.85H6.75C5.94 14.85 5.4 14.31 5.4 13.5C5.4 12.69 5.94 12.15 6.75 12.15H14.85C15.66 12.15 16.2 12.69 16.2 13.5C16.2 14.31 15.66 14.85 14.85 14.85ZM20.25 9.45H6.75C5.94 9.45 5.4 8.91 5.4 8.1C5.4 7.29 5.94 6.75 6.75 6.75H20.25C21.06 6.75 21.6 7.29 21.6 8.1C21.6 8.91 21.06 9.45 20.25 9.45Z" fill="white" />
          </svg>
          <svg className={`${showIframe ? 'button-active svg-animation fade-in-animation' : 'button-inactive svg-animation fade-out-animation'}`} width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9.00001M9 9.00001L16 16M9 9.00001L16 2M9 9.00001L2 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </>
  );
}

export default EmbedChatBot;
