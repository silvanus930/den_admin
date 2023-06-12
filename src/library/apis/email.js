import { apiPost } from '../../utils/api';

export const sendEmailToZapier = async (data, messages) => {

    console.log('Messages for email:', messages);

    const response = await fetch(
        'https://hooks.zapier.com/hooks/catch/1447697/36h18n3',
        {
            method: 'POST',
            body: data,
        },
    );
    const result = await response.json();

    // Generate the chat history email template
    const chatHistoryEmailTemplate = generateChatHistoryEmailTemplate(messages);
    console.log(chatHistoryEmailTemplate); // Use the generated template to send the email
}


function generateChatHistoryEmailTemplate(history) {
    // Opening HTML tags and CSS styling
    let emailTemplate = `
      <html>
        <head>
          <style>
            /* Add CSS styles here for the email template */
          </style>
        </head>
        <body>
          <h2>Chat History</h2>
          <ul>`;

    // Loop through the chat history and add messages to the email template
    history.forEach((message) => {
        const { avatar, content, createdAt, type, self } = message;

        // Format the message based on the type (text, image, etc.)
        let formattedMessage = '';
        if (type === 'text') {
            formattedMessage = `<li><strong>${self ? 'User' : 'Bot'}:</strong> ${content}</li>`;
        } else if (type === 'image') {
            formattedMessage = `<li><strong>${self ? 'User' : 'Bot'}:</strong> <img src="${content}" alt="Image" /></li>`;
        }

        emailTemplate += formattedMessage;
    });

    // Closing HTML tags
    emailTemplate += `
          </ul>
        </body>
      </html>`;

    return emailTemplate;
}

