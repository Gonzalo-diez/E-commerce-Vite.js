import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './Components/context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
