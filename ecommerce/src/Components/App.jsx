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
        <Home />
      </Layout>
    </>
  )
}

export default App