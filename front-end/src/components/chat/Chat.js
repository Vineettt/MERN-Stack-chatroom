/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import Messages from "./Messages/Messages";
import Input from "./Input/Input.js";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
let socket;

const Chat = () => {
  const navigate = useNavigate();
  const ENDPT = "localhost:5000";
  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  let { room_id, room_name } = useParams();
  useEffect(() => {
    socket = io(ENDPT, connectionOptions);
    socket.emit("join", { name: user.name, room_id, user_id: user._id });
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      console.log(message);
      socket.emit("sendMessage", message, room_id, () => setMessage(""));
    }
  };
  useEffect(() => {
    socket.emit("get-messages-history", room_id);
    socket.on("output-messages", (messages) => {
      setMessages(messages);
    });
  }, []);
  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, [navigate, user]);
  return (
    <div className="outerContainer">
      <div className="container">
        <Messages messages={messages} user_id={user._id} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
