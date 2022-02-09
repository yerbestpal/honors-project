import { Link } from "react-router-dom"

const Info = ({ room, users }) => {
  return (
    <section className="chat-info">
      <header>
        <h2>{room}</h2>
      </header>
      <ul>
        {Array(users).map((user, i) => (
          <li key={i}>{user.name}</li>
        ))}
      </ul>
      <footer>
        <Link to='/'>
          <button>Leave</button>
        </Link>
      </footer>
    </section>
  )
}

export default Info