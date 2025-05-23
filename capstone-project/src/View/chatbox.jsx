import React, { useState } from "react";
import '../Style/chatbox.css';
import { chatboxViewModel } from "../ViewModel/chatboxViewModel";

const Chatbox = () => {
  const {
    isOpen,
    messages,
    input,
    setIsOpen,
    handleInputChange,
    handleSend,
    handleReply
  } = chatboxViewModel();

  return (
    // Chatbox button
    <div className="chat-container">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "−" : "💬"}
        </button>
      )}

      {/* Main chat window */}
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
                    <div className="message-info">
                      <span className="timestamp">{message.timestamp}</span>
                      {message.replyTo && (
                        <span className="reply-to">
                          Replying to: <br></br>
                          {messages.find(m => m.id === message.replyTo)?.text}
                        </span>
                      )}
                    </div>
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
