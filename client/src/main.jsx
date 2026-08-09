import ThemeProvider from '@devStack/constants/Theme-Provider'
import { store } from '@devStack/store'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import AppBootstrap from './AppBootstrap'
import AppRoutes from './router/AppRoutes'

import './styles/index.css'
import './styles/custom_component.css'
import './styles/gobal_animation.css'
import './styles/terminal_scrollbar.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppBootstrap>
            <AppRoutes />
          </AppBootstrap>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
