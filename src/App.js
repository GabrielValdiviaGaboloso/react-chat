import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Conectar con el servidor Socket.IO
const socket = io('http://localhost:3000'); // Asegúrate de que esto esté apuntando al servidor backend

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Escuchar mensajes del servidor cuando se conecta
  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  // Enviar mensaje al servidor
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message); // Emitir mensaje al servidor
      setMessage(''); // Limpiar el campo de entrada
    }
  };

  return (
    <div className="App">
      <h1>Chat en tiempo real</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
