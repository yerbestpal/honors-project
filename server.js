const {addUser, getAllUsers, removeUser} = require('./utils')

const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server, { wsEngine: 'ws' })
io.on('connection', socket => {
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
  },
  socket.on('left', () => {
    const user = removeUser(socket.id)

    user && io.to(user.room).emit('message', {
      user: 'admin',
      texr: `${user.name} has just left.`
    })
  }),
  socket.on('send-message', message => {
    const user = getUser(socket.id)

    io.to(user.room).emit('message', {
      user: user.name,
      text: message
    })

    io.to(user.room).emit('room-data', {
      room: user.room,
      users: getAllUsers(user.room)
    })
  }))
})

app.get('/', (req, res) => res.send('Hello world'))

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))