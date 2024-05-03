import React, { useRef, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");

  function connect() {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Socket закрыт");
    };
    socket.current.onerror = () => {
      console.log("Socket произошла ошибка");
    };
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: "message",
    };
    socket.current.send(JSON.stringify(message));
    setValue("");
  };

  const sendEnter = (e) => {
    if (e.target.value && (e.key === 'Enter')){
      sendMessage();
    }
  }

  if (!connected) {
    return (
      <div className="connection__register register">
        <div className="connection__title">
          <h1>ozon банк</h1>
          <span>созвон</span>
        </div>
        <div className="register__menu">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register__title"
            type="text"
            placeholder="Введите имя пользователя"
            onKeyDown={event => sendEnter(event)}
          />
          <button onClick={connect} className="register__button">
            <div className="enterIco">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  d="M6.75 1.5a.75.75 0 0 0 0 1.5h4.75A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5H6.75a.75.75 0 0 0 0 1.5h4.75a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm3.03 5.97l-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H1.75a.75.75 0 0 0 0 1.5h5.69L6.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">paruyar.beget.tech
        <div className="header__logo">
          <h1>ozon банк</h1>
          <span>созвон</span>
        </div>
      </header>
      <main className="main">
        <div className="dialogs">users</div>
        <div className="chat">
          <div className="chat__messages">
            {messages.map((mess) => (
              <div className="messages" key={mess.id}>
                {mess.event === "connection" ? (
                  <div className="message__connection">
                    {mess.username} в сети
                  </div>
                ) : (
                  <div className="message__user user">
                    <div className="user__title">{mess.username}</div>
                    <div className="user__message">{mess.message}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chat__form">
            <input
              className="form__input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={event => sendEnter(event)}
            />
            <button onClick={sendMessage} className="form__button">
              <span className="enterIco">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H7.41l1.3-1.29a1 1 0 0 0-1.42-1.42l-3 3a1 1 0 0 0-.21.33a1 1 0 0 0 0 .76a1 1 0 0 0 .21.33l3 3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L7.41 14H17a3 3 0 0 0 3-3V7a1 1 0 0 0-1-1"></path></svg>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
