import React, { useState } from 'react';
import { sendMessageToBackend } from '../api/chatService'; // Ensure this function is correct
import { toast } from 'react-toastify';
import "../styles/Chatbox.css";


const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    console.log("message to send:", message);
    setLoading(true);

    try {
      // Send message to backend
      const res = await sendMessageToBackend(message);

      // Assuming res.message contains the text returned from OpenAI
      if (res && res.message) {
        setResponses((prevResponses) => [
          ...prevResponses,
          { text: res.message, type: 'response' }, // Add response to chat
        ]);
      }
    } catch (error) {
      toast.error('Too many requests. Please try again later.');
      console.error('OpenAI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-history">
        {responses.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default ChatBox;
