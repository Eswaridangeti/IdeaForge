import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { IdeaProvider } from './context/IdeaContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <IdeaProvider>
          <App />
        </IdeaProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
