const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
    
})

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@omnistack-qsrfs.mongodb.net/omnistack8?retryWrites=true&w=majority`, {
    useNewUrlParser: true
})

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(cors())
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    return res.json({ ok: true})
})

server.listen(3333);