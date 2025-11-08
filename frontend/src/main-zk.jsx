import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ZKApp from './ZKApp.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ZKApp />
  </StrictMode>,
)