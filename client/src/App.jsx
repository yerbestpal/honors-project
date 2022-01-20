import { BrowserRouter, Route, Router } from "react-router-dom"
import { Form, Chat } from "./components"
import "./App.scss"

const App = () => {
  <BrowserRouter>
    <Router>
      <Route path='/' element={Form} />
      <Route path='/chat' element={Chat} />
    </Router>
  </BrowserRouter>
}

export default App