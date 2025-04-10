import { useState } from "react";
import { addMessage } from "../Model/chatboxModel";

export const chatboxViewModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      const result = await addMessage(input, new Date().toISOString().slice(0, 19).replace('T', ' '), replyTo);

      const newMessage = {
        text: input,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        id: Date.now(),
        replyTo: replyTo,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
      setReplyTo(null);
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
