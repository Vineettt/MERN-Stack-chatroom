const moongoose = require('mongoose');
const roomSchema = new moongoose.Schema({
    name:{
        type:String,
        required:true 
    }
})

const Room = moongoose.model('room', roomSchema);
module.exports = Room;