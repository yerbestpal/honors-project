import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Info = ({ room, users }) => {
  return (
    <section as='Col' className='chat-info p-5'>
      <h5>Users</h5>
      <ul className='list-unstyled'>
        {users.map((user, i) => (
          <li key={i}>{user.name}</li>
        ))}
      </ul>
      <footer>
        <Link to='/'>
          <Button className='btn-warning'>Leave</Button>
        </Link>
      </footer>
      <br />
      <h5>Key</h5>
      <ul className='list-unstyled'>
        <li>Trust: 🤝</li>
        <li>Fear: 😱</li>
        <li>Sadness: ☹️</li>
        <li>Anger: 🤬</li>
        <li>Surprise: 🫢</li>
        <li>Disgust: 😖</li>
        <li>Joy: 😁</li>
        <li>Anticipation: 🫦</li>
        <li>Positive: 👍</li>
        <li>Negative: 👎</li>
      </ul>
    </section>
  )
}

export default Info
