import { useState, useEffect } from "react"
import io from 'socket.io-client'
import { useLocation } from "react-router-dom"
import { END_POINT } from '../Constants'
import Info from './Info'
import ChatView from './ChatView'
import { useForm } from 'react-hook-form'
import queryString from "query-string"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Container, Nav, Col, Row, Button, Form, InputGroup, FormControl } from 'react-bootstrap'

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
      // socket.emit('disconnect')
      socket.close()
      socket.off()
    }
  }, [END_POINT, location.search])

  useEffect(() => {
    socket.on('message', message => setMessages([...messages, message]))
    socket.on('room-data', ({ users }) => setUsers(users))
    console.log('MESSAGES', messages)
  }, [])

  const { register, handleSubmit, reset } = useForm()

  const sendMessage = (input) => {
    input && socket.emit('send-message', input.message)
    reset()
  }

  return (
    <main className="chat">
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/"><span className="fw-bold">Room: </span>{room}</Navbar.Brand>
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>
        <Row className="min-vh-100">
          <Col className="col-md-3 bg-info bg-gradient">
            <Info room={room} users={users} />
          </Col>
          <Col className="col-md-9 p-5">
            <Row>
              <ChatView messages={messages} name={name} room={room} socket={socket} />
            </Row>
            <Row className="pt-5 d-flex">
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
                {/* <input type='text' {...register('message', { required: true })} />
                <Button type='submit'>Send</Button> */}
              </Form>
            </Row>
          </Col>
        </Row>
    </main>
  )
}

export default Chat