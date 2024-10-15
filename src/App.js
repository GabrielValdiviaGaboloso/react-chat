import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Archivo de estilos separado

// Conectar con el servidor Socket.IO
const socket = io('https://express-chat-26up.onrender.com', {
  transports: ['websocket'], // Asegura que se use WebSocket directamente
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err);
    });

    return () => {
      socket.off('chat message');
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message); 
      setMessage('');
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h1>Chat en tiempo real</h1>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <p key={index} className="message">{msg}</p>
          ))}
        </div>

        <form onSubmit={sendMessage} className="chat-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="chat-input"
          />
          <button type="submit" className="chat-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
