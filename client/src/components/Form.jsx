import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const Form = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const onSubmit = ({ name, room }) => navigate(`/chat?name=${name}&room=${room}`)

  return (
    <main className="form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='text' { ...register('name', { required: true }) } />
        <input type='text' { ...register('room', { required: true }) } />
        <button type='submit'>Join</button>
      </form>
    </main>
  )
}

export default Form