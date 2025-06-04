// In your React app

import axios from 'axios';

const sendMessageToBackend = async (message) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/chat',  // This is the backend URL
      { message } // Send the message in the request body
    );
    return response.data; // This is the response from OpenAI
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
};

export { sendMessageToBackend };
