import { useForm } from 'react-hook-form'
import ScrollToBottom from 'react-scroll-to-bottom'
import { Card } from 'react-bootstrap'

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
          <Card key={i} 
                bg={message.user === String(name).toLowerCase() ? 'primary' : 'light'}
                text={message.user === String(name).toLowerCase() ? 'light' : 'dark'}
                >
            <Card.Header as="h5">{message.user}</Card.Header>
            <Card.Body>
              <Card.Text>
                {message.text}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </ScrollToBottom>
    </section>
  )
}

export default ChatView