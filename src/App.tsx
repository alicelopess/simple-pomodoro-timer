import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

// Routes
import { Router } from './Router'

// Themes
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />
        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
