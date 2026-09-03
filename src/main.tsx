import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ReadmeProvider } from './hooks/useReadme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReadmeProvider>
      <App />
    </ReadmeProvider>
  </React.StrictMode>,
)
