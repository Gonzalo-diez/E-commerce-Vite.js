import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import Layout from './Footer/Layout';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Login from './Login/Login';
import Registro from './Registro/Registro';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Menu />
      <Layout>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/registro" element={<Registro setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App