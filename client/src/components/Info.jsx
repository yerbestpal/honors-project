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
        <li>Trust: đ¤</li>
        <li>Fear: đą</li>
        <li>Sadness: âšī¸</li>
        <li>Anger: đ¤Ŧ</li>
        <li>Surprise: đĢĸ</li>
        <li>Disgust: đ</li>
        <li>Joy: đ</li>
        <li>Anticipation: đĢĻ</li>
        <li>Positive: đ</li>
        <li>Negative: đ</li>
      </ul>
    </section>
  )
}

export default Info
