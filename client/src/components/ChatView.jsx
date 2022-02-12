import { useForm } from 'react-hook-form'
import ScrollToBottom from 'react-scroll-to-bottom'
import { Card, Row } from 'react-bootstrap'

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
          <Row key={i}
               className={message.user === String(name).toLowerCase() ? 'p-0 m-0 col-12 mb-3' : 'p-0 m-0 col-12 mb-3'}>
            <Card bg={message.user === String(name).toLowerCase() ? 'primary' : 'light'}
                  text={message.user === String(name).toLowerCase() ? 'light' : 'dark'}
                  className={message.user === String(name).toLowerCase() ? 'p-0 m-0 mb-3 float-end' : 'p-0 m-0 mb-3 float-start'}
                  >
              <Card.Header as="h5">{message.user}</Card.Header>
              <Card.Body>
                <Card.Text>
                  {message.text}
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
        ))}
      </ScrollToBottom>
    </section>
  )
}

export default ChatView