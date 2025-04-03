import React, { useState } from "react";
import '../Style/chatbox.css'; // Add styles separately

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);  // State to store messages
    const [input, setInput] = useState("");  // State to store the current input
    const [replyTo, setReplyTo] = useState(null);  // State to store the message being replied to

    // Handle input change
    const handleInputChange = (event) => {
        setInput(event.target.value); // Update input text state
    };

    // Handle message send
    const handleSend = () => {
        if (input.trim() !== "") {
            const newMessage = {
                text: input,
                timestamp: new Date().toLocaleTimeString(), // Add timestamp
                id: Date.now(), // Unique ID for each message
                replyTo: replyTo, // Store the message being replied to
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);  // Add new message to the list
            setInput("");  // Clear input after sending
            setReplyTo(null);  // Reset the reply state
        }
    };

    // Handle reply to a specific message
    const handleReply = (message) => {
        setReplyTo(message.id);  // Set the message being replied to
        setInput(`@${message.timestamp}: `);  // Pre-fill the input with the timestamp of the message being replied to
    };

    return (
        <div className="chat-container">
            {/* Hide the chat toggle button if chatbox is open */}
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
                        {/* Display messages */}
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
