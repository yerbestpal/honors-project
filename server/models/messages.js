// This file is not actually a 'model', since it is not a class.
// instead, it is used to manage messages and perform CRUD operations on messages.db.

const path = require('path')
const Datastore = require('@seald-io/nedb')
const { rejects } = require('assert')
const db = new Datastore({ filename: path.join(__dirname) + '../../databases/messages.db', autoload: true })

const getAllRoomMessages = room => {
    return db.findAsync({ room: room }).sort({ date: 1 })
    .then((result) => {
      console.log(result)
      return result
    }).catch((err) => {
      console.log(err.message)
    })
}

const createMessage = async message => {
  const msg = await db.insertAsync(message)
  return msg
}

module.exports = { getAllRoomMessages, createMessage }