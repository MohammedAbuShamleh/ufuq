import '@fontsource/alexandria/400.css'
import '@fontsource/alexandria/500.css'
import '@fontsource/alexandria/600.css'
import '@fontsource/alexandria/700.css'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/500.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import './app/dashboard.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { Providers } from './app/Providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
