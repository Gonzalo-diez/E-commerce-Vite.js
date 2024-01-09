import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import Layout from './Footer/Layout';
import Home from './Home/Home';
import Menu from './Menu/Menu'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Menu />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App