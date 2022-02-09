import { useState, useEffect } from "react"
import io from 'socket.io-client'
import { useLocation } from "react-router-dom"
import { END_POINT } from '../Constants'
import Info from './Info'
import ChatView from './ChatView'
import { useForm } from 'react-hook-form'
import ScrollToBottom from 'react-scroll-to-bottom'
import queryString from "query-string"

let socket

const Chat = () => {
  const [name, setName] = useState('')
	const [room, setRoom] = useState('')
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const location = useLocation()

  useEffect(() => {
    // const params = new Proxy(new URLSearchParams(window.location.search), {
    //   get: (searchParams, prop) => searchParams.get(prop)
    // })
    let { name, room } = queryString.parse(location.search)

    socket = io(END_POINT)

    socket.on('welcome', data => {
      console.log('Message: ', data)
    })

    socket.onAny((event, ...args) => console.log(event, args))

    setName(name)
    setRoom(room)

    socket.emit('join', { name, room })
    return () => {
      socket.emit('left')
      socket.off()
    }
  }, [END_POINT, location.search])

  useEffect(() => {
    socket.on('message', message => setMessages([...messages, message]))
    socket.on('room-data', ({ users }) => setUsers(users))
  }, [])

  const { register, handleSubmit, reset } = useForm()

  const sendMessage = () => {
    console.log(message)
    message && socket.emit('send-message', message)
    socket.onAny((event, ...args) => console.log(event, args))
    reset()
  }

  return (
    <main className="chat">
      <Info room={room} users={users} />
      {/* <ChatView messages={messages} name={name} room={room} socket={socket} /> */}

      <section className='chat-view'>
        <ScrollToBottom className='messages'>
          {messages.map((message, i) => (
            <li key={i}>
              <span>{message.user}</span>
              <p>{message.text}</p>
            </li>
          ))}
        </ScrollToBottom>
        <form onSubmit={handleSubmit(sendMessage)}>
          <input type='text' {...register('message', { required: true })} />
          <button type='submit'>Send</button>
        </form>
      </section>
    </main>
  )
}

export default Chat