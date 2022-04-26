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
const { text } = require('express')

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

// const convertSentimentToEmoji = (sentimentScore) => {
//   switch (true) {
//     case sentimentScore === 0:
//       return '😐'
//     case sentimentScore >= 5:
//       return '👍'.repeat(5)
//     case sentimentScore > 0:
//       return '👍'.repeat(sentimentScore)
//     case sentimentScore <= -5:
//       return '👎'.repeat(5)
//     case sentimentScore < 0:
//       return '👎'.repeat(Math.abs(sentimentScore))
//   }
// }

const convertSentimentToEmoji = (sentimentScore) => {
  switch (true) {
    case sentimentScore === 0:
      return '😐'
    case sentimentScore > 0:
      return '👍'
    case sentimentScore < 0:
      return '👎'
  }
}

const PORT = process.env.PORT || 80

const httpServer = createServer(app)
const io = socketIo(httpServer, {
  cors: {
    origin: 'https://honors-project-client.vercel.app',
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

    if (existingMessages.length >= 1) {
      console.log('existingMessages: ', existingMessages)
      socket.emit('load-existing-messages', {
        messages: existingMessages,
      })
    } else {
      const botMessages = [
        // Positive messages
        {
          user: 'bot',
          text: '1. We are delighted that you will be coming to visit us. It will be so nice to have you here.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '2. Even in hard times when I don\'t have a lot of money, I stay hopeful and believe that next month will be better.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '3. Grandpa was very proud of me when I got a promotion at work. He took me out to dinner to celebrate.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '4. Maggie is a fearless friend of mine. She will try anything once, no matter how dangerous the activity is.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '5. Although the storm destroyed many of the buildings along the shore, we feel fortunate that our house didn\'t suffer any damage.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        // Negative messages
        {
          user: 'bot',
          text: '6. Walking to the bank to deposit money makes me very uneasy. I\'m always scared someone is going to rob me.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '7. It\'s said that children without siblings grow up to be selfish adults because they never learn to share with others.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '8. I\'m a little doubtful about whether to get married or not.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '9. The stubborn employee refused to accept that he made a mistake. He kept insisting that he wasn\'t wrong.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '10. I am absolutely furious!! I cannot believe that my dog chewed my favorite shoes. Now they\'re ruined!',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        // Neutral messages
        {
          user: 'bot',
          text: '11. I feel okay, it\'s just another day.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '12. I neither agree nor disagree with the statement.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '13. The reception to the play was lukewarm to say the least.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '14. I don\'t have a strong opinion, either way.',
          room: user.room,
          date: Date.now(),
          emoji: []
        },
        {
          user: 'bot',
          text: '15. The weather is standard for this time of year',
          room: user.room,
          date: Date.now(),
          emoji: []
        }
      ]

      botMessages.forEach(message => {
        getMessageEmojis(message.text, message.emoji)
        message.emoji = [...new Set(message.emoji)]
        message.sentiment = convertSentimentToEmoji(sentiment(message.text).score)
      })

      socket.emit('load-existing-messages', {
        messages: botMessages,
      })
    }

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

    getMessageEmojis(message, messageEmoji)

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

const getMessageEmojis = (message, messageEmoji) => {
  const messageToArray = message.split(' ')

  const nrcWordsArray = []
  Object.keys(nrcWords).forEach((key) => nrcWordsArray.push({
    word: key,
    emotions: nrcWords[key],
  })
  )

  messageToArray.forEach((word) => {
    // let wordIsPresentInGroup
    nrcWordsArray.forEach((nrcWord) => {
      if (word.toLowerCase().trim() === nrcWord.word.toLowerCase().trim()) {
        // wordIsPresentInGroup = true
        nrcWord.emotions.forEach((emotion) => messageEmoji.push(getEmojiFromWord(emotion.toLowerCase().trim()))
        )
      }
    })
  })
}

