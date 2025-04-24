import { useState, useEffect } from "react";
import { addMessage, getMessage } from "../Model/chatboxModel";
import { jwtDecode } from "jwt-decode";

export const chatboxViewModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  // Get username from token
  const username = jwtDecode(localStorage.getItem('authToken')).username;
  if (!username) {
    console.error("No credentials found. Please log in");
    return;
  }

  // Retrieve all messages. Triggers when you log in, sign out, or post a message.
  useEffect(() => {
    const getAllMessage = async () => {
      const result = await getMessage();
      if (result && result.data) {
        const newMessages = result.data.map((msg) => {
          return {
            text: msg.message,
            timestamp: new Date(msg.sendTime).toISOString().slice(0, 19).replace('T', ' '),
            id: msg.messageId,
            replyTo: msg.replyId
          };
        });
        setMessages(newMessages)
      }
    };

    if (username) {
      getAllMessage();
    }
  }, [username, messages]);

  // Update text variable when user types.
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Post a message
  const handleSend = async () => {
    console.log(messages);

    if (input.trim() !== "") {
      const result = await addMessage(username, input, new Date().toISOString().slice(0, 19).replace('T', ' '), replyTo);

      if (result) {
        const messageId = result.data;

        const newMessage = {
          text: input,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          id: messageId,
          replyTo: replyTo,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");
        setReplyTo(null);
      } 
    }
  };

  // Handle replying
  const handleReply = (message) => {
    setReplyTo(message.id);
    setInput(`@${message.timestamp}: `);
  };

  return {
    isOpen,
    messages,
    input,
    setIsOpen,
    handleInputChange,
    handleSend,
    handleReply
  };
};
