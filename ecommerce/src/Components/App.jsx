import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Footer/Layout';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Login from './Login/Login';
import Registro from './Registro/Registro';
import AgregarProductos from './Agregar/AgregarProducto';
import BorrarProducto from './Borrar/BorrarProducto';
import EditarProducto from './Editar/EditarProducto';
import Carrito from './Carrito/Carrito';
import ProductoCategoria from './Productos/Categoria/ProductoCategoria';
import Producto from './Productos/Producto';
import User from './User/User';
import EditarPassword from './Editar/EditarPassword';
import EditarPerfil from './Editar/EditarPerfil';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const addToCart = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const removeFromCart = (productId) => {
    const updatedCarrito = [...carrito];
    const index = updatedCarrito.findIndex((producto) => producto._id === productId);
  
    if (index !== -1) {
      updatedCarrito.splice(index, 1);
      setCarrito(updatedCarrito);
    }
  };

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUsuario={setUsuario} />} />
          <Route path="/registro" element={<Registro setIsAuthenticated={setIsAuthenticated} setUsuario={setUsuario} />} />
          <Route path="/user/:userId" element={<User isAuthenticated={isAuthenticated} usuario={usuario} setUsuario={setUsuario} />} />
          <Route path="/user/editarPerfil/:id" element={<EditarPerfil />} />
          <Route path="/user/cambiarContrasena/:id" element={<EditarPassword />} />
          <Route path="/productos/detalle/:id" element={<Producto isAuthenticated={isAuthenticated} addToCart={addToCart} usuario={usuario} />} />
          <Route path="/productos/:categoria" element={<ProductoCategoria />} />
          <Route path="/agregarProductos" element={<AgregarProductos isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/borrarProducto/:id" element={<BorrarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/productos/editarProducto/:id" element={<EditarProducto isAuthenticated={isAuthenticated} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} removeFromCart={removeFromCart} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;