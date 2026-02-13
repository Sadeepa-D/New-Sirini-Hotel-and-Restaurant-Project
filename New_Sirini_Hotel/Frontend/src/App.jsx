import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//import './App.css'
import Receptionhall from './Pages/receptionhall'
import Resturant from './Pages/resturant'
import Rooms from './Pages/rooms'
import LiquorShop from './Pages/liquorshop'
import HeaderComponent from './components/header_component';
import FooterComponent from './components/footer_component';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      {/* header */}
      <HeaderComponent />

      <div>
        <Routes>
          <Route path="/receptionhall" element={<Receptionhall />} />
          <Route path="/resturant" element={<Resturant />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/LiquorShop" element={<LiquorShop />} />
        </Routes>
      </div>
      
      {/* Footer */}
      <FooterComponent />
    </Router>

  );
}


export default App
