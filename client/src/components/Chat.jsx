import { useState, useEffect } from "react"
import io from 'socket.io-client'
import { useLocation } from "react-router-dom"
import { END_POINT } from '../Constants'
import Info from './Info'
import Messages from './Messages'
import { useForm } from 'react-hook-form'
import queryString from "query-string"
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar/NavBar'
import {
  Col,
  Row,
  Button,
  Form,
  InputGroup,
  FormControl
} from 'react-bootstrap'

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

    socket.onAny((event, ...args) => console.log(event, args))

    setName(name)
    setRoom(room)

    socket.emit('join', { name, room })

    return () => {
      socket.close()
      socket.off()
    }
  }, [END_POINT, location.search])

  useEffect(() => {
    const existingMessages = messages
    socket.on('load-existing-messages', messages => {
      if (messages) {
        messages['messages'].forEach(message => {
          existingMessages.push(message)
        })
        console.log('Data: ', messages['messages'])
        setMessages(existingMessages)
      }
    })

    const newMessages = messages
    socket.on('message', message => {
      newMessages.push(message)
      setMessages(newMessages)
    })
    socket.on('room-data', ({ users }) => setUsers(users))
  }, [])

  const { register, handleSubmit, reset } = useForm()

  const sendMessage = (input) => {
    input && socket.emit('send-message', input.message)
    reset()
  }

  return (
    <div>
      <NavBar room={room} />
      <main className="chat">
          <Row id="message-container">
            <Col className="col-md-3 bg-info bg-gradient">
              <Info room={room} users={users} />
            </Col>
            <Col className={"col-md-9 p-5"}>
              <Row>
                <Messages messages={messages} name={name} room={room} socket={socket} />
              </Row>
              <Row className={"pt-5 d-flex"}>
                <Form onSubmit={handleSubmit(sendMessage)}>
                  <InputGroup className="mb-3">
                    <FormControl type="text"
                      placeholder="Enter a message"
                      aria-label="Enter a message"
                      aria-describedby="basic-addon2"
                      {...register('message', { required: true })}
                    />
                    <Button variant="outline-secondary" id="button-addon2" type="submit">
                      Send
                    </Button>
                  </InputGroup>
                </Form>
              </Row>
            </Col>
          </Row>
      </main>
    </div>
  )
}

export default Chat