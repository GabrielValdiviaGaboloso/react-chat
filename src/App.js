import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Conectar con el servidor Socket.IO
const socket = io('https://express-chat-26up.onrender.com', {
  transports: ['websocket'], // Asegura que se use WebSocket directamente
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Escuchar mensajes del servidor cuando se conecta
  useEffect(() => {
    // Conexión al servidor Socket.IO
    socket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    // Recibir mensaje desde el servidor
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Manejo de errores de conexión
    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err);
    });

    // Desconectar el socket al desmontar el componente
    return () => {
      socket.off('chat message');
      socket.disconnect();
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
