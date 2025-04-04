import React, { useState } from "react";
import '../Style/chatbox.css';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [replyTo, setReplyTo] = useState(null);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = () => {
        if (input.trim() !== "") {
            const newMessage = {
                text: input,
                timestamp: new Date().toLocaleTimeString(),
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

    return (
        <div className="chat-container">
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "−" : "💬"}
                </button>
            )}

            {isOpen && (
                <div className="chatbox">
                    <div className="chat-header">
                        <div className="chat-title">Chat</div>
                        <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="chat-body">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <div key={message.id} className="chat-message">
                                    <div className="message-text">
                                        {message.text}
                                    </div>
                                    <div className="message-footer">
                                        <span className="timestamp">{message.timestamp}</span>
                                        {message.replyTo && (
                                            <span className="reply-to">
                                                Replying to message from {messages.find(m => m.id === message.replyTo)?.timestamp}
                                            </span>
                                        )}
                                        <button className="reply-button" onClick={() => handleReply(message)}>
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="chat-message">No messages yet.</div>
                        )}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
