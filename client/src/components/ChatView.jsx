import { useForm } from 'react-hook-form'
import ScrollToBottom from 'react-scroll-to-bottom'

const ChatView = ({ messages, name, room, socket }) => {
  const { register, handleSubmit, reset } = useForm()

  const sendMessage = ({ message }) => {
    message && socket.emit('send-message', message)
    socket.onAny((event, ...args) => console.log(event, args))
    reset()
  }

  return (
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
  )
}

export default ChatView