const express = require('express')
const app = express()
const { createServer } = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./models/users')
const { getAllRoomMessages, createMessage } = require('./models/messages')
const sentiment = require('nrc-sentiment')
const nrcWords = require('./models/nrc_en.json')

const getEmojiFromWord = (word) => {
  switch (word) {
    case 'trust':
      return '🤝'
    case 'fear':
      return '😱'
    case 'negative':
      return '👎'
    case 'sadness':
      return '☹️'
    case 'anger':
      return '🤬'
    case 'surprise':
      return '🫢'
    case 'positive':
      return '👍'
    case 'disgust':
      return '😖'
    case 'joy':
      return '😁'
    case 'anticipation':
      return '🫦'
  }
}

const convertSentimentToEmoji = (sentimentScore) => {
  switch (true) {
    case sentimentScore === 0:
      return '😐'
    case sentimentScore >= 5:
      return '👍'.repeat(5)
    case sentimentScore > 0:
      return '👍'.repeat(sentimentScore)
    case sentimentScore <= -5:
      return '👎'.repeat(5)
    case sentimentScore < 0:
      return '👎'.repeat(Math.abs(sentimentScore))
  }
}

const PORT = process.env.PORT || 80

const httpServer = createServer(app)
const io = socketIo(httpServer, {
  cors: {
    origin: 'https://honors-project-server.vercel.app',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['secretHeader'],
    credentials: true,
  },
})

app.use(cors())

app.get('/', (req, res) => res.send('Server connection successful'))

io.on('connection', (socket) => {
  console.log('Client is connected')

  socket.on('join', async (data) => {
    console.log('joined')
    const { name, room } = data
    const { error, user } = addUser({ id: socket.id, name, room })
    if (error) return

    const existingMessages = await getAllRoomMessages(room)
    // console.log('existingMessages: ', existingMessages)

    socket.emit('load-existing-messages', {
      messages: existingMessages,
    })

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome.`,
      room: user.room,
      date: Date.now(),
    })

    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has just entered the room.`,
    })

    socket.join(user.room)
    const users = getUsersInRoom(user.room)
    io.to(user.room).emit('room-data', {
      room: user.room,
      users: users,
    })
  })

  socket.on('send-message', (message) => {
    const messageEmoji = []

    const messageToArray = message.split(' ')

    console.log(sentiment("I'm very happy"))

    const nrcWordsArray = []
    Object.keys(nrcWords).forEach((key) =>
      nrcWordsArray.push({
        word: key,
        emotions: nrcWords[key],
      })
    )

    messageToArray.forEach((word) => {
      // let wordIsPresentInGroup
      nrcWordsArray.forEach((nrcWord) => {
        if (word.toLowerCase().trim() === nrcWord.word.toLowerCase().trim()) {
          // wordIsPresentInGroup = true
          nrcWord.emotions.forEach((emotion) =>
            messageEmoji.push(getEmojiFromWord(emotion.toLowerCase().trim()))
          )
        }
      })
      // if (wordIsPresentInGroup) {
      //   messageEmoji.push(' - ')
      // }
      // !wordIsPresentInGroup
    })

    // Remove ' - ' from the end of emoji array
    // if (messageEmoji[messageEmoji.length - 1] === ' - ') messageEmoji.pop()

    // Remove duplicate emoji
    // for (let i = 0; i < messageEmoji.length; i++) {
    //   for (let j = 0; j < messageEmoji.length; j++) {
    //     if (i !== j) {
    //       if (messageEmoji[i] === messageEmoji[j]) {
    //         messageEmoji.splice(messageEmoji.indexOf(messageEmoji[i]), 1)
    //       }
    //     }
    //   }
    // }

    // Remove ' - ' from the start of emoji array
    // if (messageEmoji[0] === ' - ') messageEmoji.shift()

    const user = getUser(socket.id)
    console.log('user: ', user)
    const msg = {
      user: user.name,
      text: message,
      room: user.room,
      date: Date.now(),
      emoji: [...new Set(messageEmoji)],
      sentiment: convertSentimentToEmoji(sentiment(message).score),
    }
    createMessage(msg)

    try {
      io.to(user.room).emit('message', msg)

      const users = getUsersInRoom(user.room)
      io.to(user.room).emit('room-data', {
        room: user.room,
        users: users,
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
      text: `${user.name} has just left.`,
      room: user.room,
      date: Date.now(),
    })
  })
})

httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
