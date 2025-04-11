import { useState, useEffect } from "react";
import { addMessage, getMessage } from "../Model/chatboxModel";
import { jwtDecode } from "jwt-decode";

export const chatboxViewModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const username = jwtDecode(localStorage.getItem('authToken')).username;
  if (!username) {
    console.error("No credentials found. Please log in");
    return;
  }

  useEffect(() => {
    const getAllMessage = async () => {
      const result = await getMessage();
      if (result && result.data) {
        const newMessages = result.data.map((msg) => {
          return {
            text: msg.message,
            timestamp: new Date(msg.sendTime).toISOString().slice(0, 19).replace('T', ' '),
            id: msg.messageId,
            replyTo: msg.isReply ? true : false,
          };
        });
        setMessages(newMessages)
      }
    };

    if (username) {
      getAllMessage();
    }
  }, [username, messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      const result = await addMessage(input, new Date().toISOString().slice(0, 19).replace('T', ' '), replyTo);
      console.log(result)

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
