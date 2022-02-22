const express = require('express')
const app = express()
const { createServer } = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./models/users')

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

  socket.on('join', data => {
    console.log('joined')
    const { name, room } = data
    const { error, user } = addUser({ id: socket.id, name, room })
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
    const users = getUsersInRoom(user.room)
    io.to(user.room).emit('room-data', {
      room: user.room,
      users: users
    })
  })

  socket.on('send-message', message => {
    const user = getUser(socket.id)
    console.log('user: ', user)

    try {
      io.to(user.room).emit('message', {
        user: user.name,
        text: message
      })
  
      const users = getUsersInRoom(user.room)
      io.to(user.room).emit('room-data', {
        room: user.room,
        users: users
      })
    } catch (error) {
      console.log(error.message)
    }
  })
    
  socket.on('disconnect', () => {
    console.log('disconnected')

    const user = removeUser(socket.id)

    io.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has just left.`
    })
  })
})

httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`))