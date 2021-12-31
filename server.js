const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require("socket.io");
const io = socketio(http);
const mongoDB = "mongodb://localhost:27017/chatroom";
mongoose.connect(mongoDB).then(()=>console.log('connected')).catch(isError=>console.log(error));
const {addUser, getUser, removeUser} = require('./helper');
const PORT = process.env.port || 5000;
const Room = require('./models/Room');
const Message = require('./models/Message');
const corsOption = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

io.on('connection', (socket) => {
  console.log(socket.id);
  Room.find().then(result=>{
    socket.emit("output-rooms", result);
  })
  socket.on('create-room', name=>{
    const room = new Room ({name});
    room.save().then(result=>{
      io.emit('room-created', result);
    })
  })
  socket.on('join', ({name, room_id, user_id})=>{
    const {error, user} = addUser({
      socket_id: socket.id,
      name, room_id,
      user_id
    })
    socket.join(room_id);
    if(error){
      console.log('join error', error)
    }else{
    }
  })
  socket.on('sendMessage', (message, room_id, callback)=>{
    const user = getUser(socket.id);
    const msgToStore = {
      name:user.name,
      user_id:user.user_id,
      room_id,
      text:message
    }
    console.log('message', msgToStore);
    const msg = new Message(msgToStore);
    msg.save().then(result=>{
      io.to(room_id).emit('message', msgToStore);
      callback();
    })
  })
  socket.on('get-messages-history', room_id => {
    Message.find({ room_id }).then(result => {
        socket.emit('output-messages', result)
    })
})
  socket.on('disconnect', ()=>{
    const user = removeUser(socket.id);
  })
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});