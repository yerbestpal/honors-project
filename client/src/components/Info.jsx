import { Link } from "react-router-dom"
import { Button } from 'react-bootstrap'

const Info = ({ room, users }) => {
  return (
    <section as="Col" className="chat-info p-5">
    <h5>Users</h5>
      <ul className="list-unstyled">
        {users.map((user, i) => (
          <li key={i}>{user.name}</li>
        ))}
      </ul>
      <footer>
        <Link to='/'>
          <Button className="btn-warning">Leave</Button>
        </Link>
      </footer>
    </section>
  )
}

export default Info