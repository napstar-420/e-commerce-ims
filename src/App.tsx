import { RouterProvider } from "react-router-dom"
import { router } from './router'
import { AuthProvider } from "./context/Auth"
import { ThemeProvider } from "./context/Theme"
import { AlertProvider } from "./context/Alert"
import { ThemeType } from "./dto"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider initTheme={ThemeType.LIGHT}>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
