import { RouterProvider } from "react-router-dom"
import { router } from './router'
import { ThemeProvider } from "./context/Theme"
import { ThemeType } from "./dto"

function App() {
  return (
    <ThemeProvider initTheme={ThemeType.LIGHT}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
