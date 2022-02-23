// This file is not actually a 'model', since it is not a class.
// instead, it is used to manage users within a session.

let users = []

const addUser = ({ id, name, room }) => {
  console.log('IT WORKS')
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()

  const userExists = users.find(user => user.name === name && user.room === room)

  if (!room || !name || userExists) return { error: 'error' }
  const user = { id, name, room }
  users = [...users, user]
  return { user }
}

const removeUser = (id) => {
  const i = users.findIndex(user => user.id === id)
  return i !== -1 ? users.splice(i, 1)[0] : null
}

const getUser = (id) => users.filter(user => user.id === id)[0]

const getUsersInRoom = room => users.filter(user => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }