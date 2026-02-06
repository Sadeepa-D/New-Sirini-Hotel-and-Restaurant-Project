import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Receptionhall from './pages/receptionhall'
import Resturant from './pages/resturant'
import Rooms from './pages/rooms'
import LiquorShop from './pages/liquorshop'
function App() {


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/receptionhall" element={<Receptionhall />} />
          <Route path="/resturant" element={<Resturant />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/LiquorShop" element={<LiquorShop />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
