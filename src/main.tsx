import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ReadmeProvider } from './hooks/useReadme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReadmeProvider>
        <App />
      </ReadmeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
