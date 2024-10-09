import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'


function App() {

  return (
    <div>
    <BrowserRouter>
    <Routes>
      <Route path = "/signup" element={<Signup/> }/>
      <Route path = "/signin" element={<Signin/>}/> 
      <Route path = "/blog" element={<Blog/>}/>




    </Routes>



    </BrowserRouter>
    
    </div>
  )
}

export default App
