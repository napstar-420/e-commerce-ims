import { RouterProvider } from "react-router-dom"
import { router } from './router'
import { ThemeProvider } from "./context/Theme"
import { AlertProvider } from "./context/Alert"
import { ThemeType } from "./dto"

function App() {
  return (
    <ThemeProvider initTheme={ThemeType.LIGHT}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ThemeProvider>
  )
}

export default App
