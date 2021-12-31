/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import { Link } from "react-router-dom";
import RoomList from "./RoomList";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";

let socket;

const Home = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const ENDPT = 'localhost:5000';
  var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};
  useEffect(() => {
    socket = io(ENDPT,connectionOptions);
    return () => {
      socket.emit('Disconnnect');
      socket.off(ENDPT);
    }
  }, [ENDPT]);
  useEffect(() => {
    socket.on('room-created', room=>{
      setRooms([...rooms, room])
    })
  }, [rooms])
  useEffect(() => {
    socket.on('output-rooms', rooms=>{
      setRooms(rooms)
    })
  }, [])
  const handleSubmit = e=>{
    e.preventDefault();
    socket.emit('create-room', room);
    console.log(room);
    setRoom('');
  }

  useEffect(() => {
    if(!user){
      return navigate("/login");
     }
  }, [navigate, user]);

  return (
    <div>
      <div className="row">
        <div className="col s12 m6">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">
                Welcome {user ? user.name : ""}
              </span>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="room"
                        placeholder="Enter your room name"
                        type="text"
                        className="validate" value = {room} onChange={e=>setRoom(e.target.value)}
                      />
                      <label htmlFor="room">Room</label>
                    </div>
                  </div>
                  <button className="btn">Create Room</button>
                </div>
              </form>
            </div>
   
          </div>
        </div>
        <div className="col s6 m5 offset-1">
            <RoomList rooms={rooms} />
        </div>
      </div>
    </div>
  );
};

export default Home;
