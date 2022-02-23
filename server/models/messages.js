const path = require('path')
const Datastore = require('@seald-io/nedb')
console.log(path.join(__dirname))
const db = new Datastore({ filename: path.join(__dirname) + '../../databases/messages.db', autoload: true })

const getAllRoomMessages = async room => {
  const messages = await db.findAsync({ room: room })
  return messages
}

module.exports = { getAllRoomMessages }