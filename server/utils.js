exports.connectToDb = (dbFilePath, DAO) => {
  const Datastore = require('@seald-io/nedb')
  const path = require('path')
  console.log(path.join(__dirname))

  if (dbFilePath) {
    // Embedded mode
    DAO.db = new Datastore({
      filename: path.join(__dirname) + dbFilePath,
      autoload: true,
    })
    console.log(`DB is connected to: ${dbFilePath}`)
  } else {
    // In-memory mode (restarts every time - useful during development)
    DAO.db = new Datastore()
    console.log('Successfully connected to DB in in-memory mode')
  }
}
