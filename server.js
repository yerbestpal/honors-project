const express = require('express')
const app = express()
const { createServer } = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const ws = require('ws')

const {addUser, getAllUsers, removeUser} = require('./utils')
const PORT = process.env.PORT || 4001


const httpServer = createServer(app)
// const io = new Server(httpServer, { wsEngine: ws.Server })
const io = socketIo(httpServer, {
  cors: {
    origin: '*',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['secretHeader'],
    credentials: true
  }
})

app.use(cors())

app.get('/', (req, res) => res.send('Server connection successful'))

io.on('connection', socket => {
  console.log('Client is connected')

  socket.emit('welcome', 'hello and welcome to the server')

  socket.on('join', data => {
    const { name, room } = data
    const { user, error } = addUser({ id: socket.id, name, room })

    if (error) return

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome.`
    })

    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has just entered the room.`
    })

    socket.join(user.room)

    io.to(user.room).emit('room-data', {
      room: user.room,
      users: getAllUsers(user.room)
    })
  })
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    user && io.to(user.room).emit('message', {
      user: 'admin',
      texr: `${user.name} has just left.`
    })
  })

  socket.on('send-message', async (message, callback) => {
    const user = await getUser(socket.id)

    try {
      io.to(user.room).emit('message', {
        user: user.name,
        text: message
      })
  
      io.to(user.room).emit('room-data', {
        room: user.room,
        users: getAllUsers(user.room)
      })
      callback()
    } catch (error) {
      console.log(error.message)
    }
  })
})

httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`))