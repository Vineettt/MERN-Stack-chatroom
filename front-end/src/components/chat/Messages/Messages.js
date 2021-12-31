import React from 'react'
import Message from '../Message/Message.js';
import './Messages.css';
import STB from 'react-scroll-to-bottom';

const Messages = ({messages, user_id}) => {
    return (
        <STB className="messages">
            {messages.map((message, i) => (
                <Message key={i} message={message} current_uuid={user_id} />
            ))}
        </STB>
    )
}

export default Messages
