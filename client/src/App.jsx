import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Form from './components/Form'
import Chat from './components/Chat'
// import "./App.scss"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Form/>} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
    </Router>
  )
}

export default App