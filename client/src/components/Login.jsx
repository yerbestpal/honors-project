import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Container,
  Nav,
  Col,
  Row,
  Button,
  Form,
  InputGroup,
  FormControl,
} from 'react-bootstrap'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const onSubmit = ({ name, room }) =>
    navigate(`/chat?name=${name}&room=${room}`)

  return (
    <main className='form d-flex justify-content-center align-items-center flex-column my-5'>
      <h1>Chat App</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup className='mb-3'>
          <FormControl
            type='text'
            placeholder='Enter your name'
            aria-label='Enter your name'
            aria-describedby='basic-addon2'
            {...register('name', { required: true })}
          />
        </InputGroup>
        <InputGroup className='mb-3'>
          <FormControl
            type='text'
            placeholder='Enter a room name'
            aria-label='Enter a room name'
            aria-describedby='basic-addon2'
            {...register('room', { required: true })}
          />
        </InputGroup>
        <InputGroup className='mb-3 d-flex justify-content-end'>
          <Button variant='outline-secondary' id='button-addon2' type='submit'>
            Join
          </Button>
        </InputGroup>
      </Form>
    </main>
  )
}

export default Login
